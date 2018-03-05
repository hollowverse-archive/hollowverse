import React from 'react';
import formatDate from 'date-fns/format';

import classes from './EditorialSummary.module.scss';
import { prettifyUrl } from 'helpers/prettifyUrl';
import { EditorialSummaryNodeType, NotablePersonQuery } from 'api/types';
import { Quote } from 'components/Quote/Quote';
import { Collapsable } from 'components/Collapsable/Collapsable';

type NotablePerson = NonNullable<NotablePersonQuery['notablePerson']>;

type Props = NonNullable<NotablePerson['editorialSummary']> & { id: string };

type Node = ArrayElement<Props['nodes']>;

const findChildren = (node: Node, nodes: Node[]) => {
  return nodes.filter(child => child.parentId === node.id);
};

const isBlockNode = (node: Node) => {
  return [
    EditorialSummaryNodeType.heading,
    EditorialSummaryNodeType.paragraph,
    EditorialSummaryNodeType.quote,
  ].includes(node.type);
};

const isRootBlock = (node: Node) => !node.parentId;

type Source = {
  number: number;
  sourceId: string;
  nodeId: string;
  sourceUrl: string;
  sourceTitle: string | null;
};

type BlockProps = {
  node: Node;
  nodes: Node[];
  referencesMap: Map<Node, Source>;
  onSourceClick?: React.EventHandler<React.MouseEvent<HTMLAnchorElement>>;
};

const Block = (props: BlockProps): JSX.Element => {
  const { node, nodes, referencesMap, onSourceClick } = props;
  const children = findChildren(node, nodes).map(child => {
    if (isBlockNode(child)) {
      return <Block key={child.id} {...props} node={child} />;
    } else if (child.type === 'link' && child.sourceUrl) {
      return (
        <a
          key={child.id}
          title={child.sourceTitle || undefined}
          href={child.sourceUrl}
        >
          {child.text}
        </a>
      );
    }

    const ref = referencesMap.get(child);

    return (
      <span key={child.id}>
        {child.type === 'emphasis' ? <em>{child.text}</em> : child.text}
        {ref ? (
          <a id={ref.nodeId} onClick={onSourceClick} href={`#${ref.sourceId}`}>
            <sup>{ref.number}</sup>
          </a>
        ) : null}
      </span>
    );
  });

  if (node.type === 'quote') {
    return (
      <Quote key={node.id} size="large">
        {children}
      </Quote>
    );
  } else if (node.type === 'heading') {
    return <h3 key={node.id}>{children}</h3>;
  }

  return <p key={node.id}>{children}</p>;
};

/**
 * Finds and adds references to `map` by performing a depth-first search
 * for nodes with `sourceUrl`s.
 *
 * Why depth-first search?
 * ----------------------
 * Sources should follow the same order of their reference positions.
 * We traverse the nodes by the order they would appear on the screen and
 * collect the sources they are found.
 */
const findRefs = (nodes: Node[], map: Map<Node, Source>) => (node: Node) => {
  const { sourceUrl, sourceTitle, type } = node;
  if (sourceUrl && type !== 'link') {
    const number = map.size + 1;
    map.set(node, {
      number,
      sourceId: `source_${number}`,
      nodeId: `ref_${number}`,
      sourceUrl: sourceUrl,
      sourceTitle,
    });
  }

  findChildren(node, nodes).forEach(findRefs(nodes, map));
};

type State = {
  shouldShowSources: boolean;
};

export class EditorialSummary extends React.PureComponent<Props, State> {
  references = new Map<Node, Source>();

  state: State = {
    shouldShowSources: true,
  };

  constructor(props: Props, context: any) {
    super(props, context);

    const { nodes } = props;

    // Collect references in nodes to create the Sources section at the end
    // of the editorial summary.
    nodes.filter(isRootBlock).forEach(findRefs(nodes, this.references));
  }

  componentDidMount() {
    // The server markup should have the sources shown by default (see default `state` above)
    // so that users can click on a reference in the content to go the source.
    // even if they have disabled JavaScript in the browser.
    //
    // When JS is executed on the client, React calls `componentDidMount`
    // and sees that, `shouldShowSources` is now `false`,
    // so it hides them.
    this.setState({ shouldShowSources: false });
  }

  onSourceClick: BlockProps['onSourceClick'] = () => {
    this.setState({ shouldShowSources: true });
  };

  render() {
    const { nodes, author, lastUpdatedOn } = this.props;
    const { shouldShowSources } = this.state;

    const date = lastUpdatedOn ? new Date(lastUpdatedOn) : undefined;

    return (
      <div className={classes.root}>
        {nodes
          .filter(isRootBlock)
          .map(node => (
            <Block
              key={node.id}
              node={node}
              nodes={nodes}
              referencesMap={this.references}
              onSourceClick={this.onSourceClick}
            />
          ))}
        <hr />
        <Collapsable
          className={classes.sourceListContainer}
          isOpen={shouldShowSources}
          label={<h3>Sources</h3>}
        >
          <small>
            <ol className={classes.sourceList}>
              {Array.from(this.references.values()).map(ref => {
                const { nodeId, sourceId, sourceUrl, sourceTitle } = ref;
                const prettifiedUrl = prettifyUrl(sourceUrl);

                return (
                  <li key={nodeId} id={sourceId}>
                    <a href={sourceUrl}>{sourceTitle || prettifiedUrl}</a>
                    {sourceTitle ? ` ${prettifiedUrl}` : null}
                    <a
                      className={classes.backLink}
                      href={`#${nodeId}`}
                      role="button"
                      aria-label="Go back to reference"
                    >
                      ↩&#xFE0E;
                    </a>
                  </li>
                );
              })}
            </ol>
          </small>
        </Collapsable>
        <hr />
        <footer className={classes.footer}>
          <small>
            This article was written by {author}
            {date ? (
              <time dateTime={date.toISOString()}>
                {' '}
                and was last updated on {formatDate(date, 'MMMM D, YYYY')}
              </time>
            ) : null}.
          </small>
        </footer>
      </div>
    );
  }
}
