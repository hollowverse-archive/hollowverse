/* tslint:disable no-unnecessary-type-assertion */

import React from 'react';
import formatDate from 'date-fns/format';

import { prettifyUrl } from 'helpers/prettifyUrl';
import { EditorialSummaryNodeType, NotablePersonQuery } from 'api/types';
import { Quote } from 'components/Quote/Quote';
import { ArrayElement } from 'typings/typeHelpers';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';

type NotablePerson = NonNullable<NotablePersonQuery['notablePerson']>;

const styles = (theme: Theme) =>
  createStyles({
    articleText: {
      padding: theme.spacing.unit * 3,
    },
    backLink: {
      display: 'inline-block',
      borderRadius: '50%',
      marginLeft: theme.spacing.unit,
      padding: theme.spacing.unit / 8,
      '&:hover': {
        textDecoration: 'none',
        backgroundColor: theme.palette.action.hover,
      },
    },
    sourceList: {
      padding: `0 ${theme.spacing.unit * 3}px`,
    },
    sourceListItem: {
      marginLeft: theme.spacing.unit,
      marginTop: theme.spacing.unit,
    },
  });

type Props = NonNullable<NotablePerson['editorialSummary']> & {
  id: string;
} & WithStyles<ReturnType<typeof styles>>;

type Node = ArrayElement<Props['nodes']>;

const findChildren = (node: Node, nodes: Node[]) =>
  nodes.filter(child => child.parentId === node.id);

const isBlockNode = (node: Node) =>
  [
    EditorialSummaryNodeType.HEADING,
    EditorialSummaryNodeType.PARAGRAPH,
    EditorialSummaryNodeType.QUOTE,
  ].includes(node.type.toUpperCase() as EditorialSummaryNodeType);

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

  // eslint-disable-next-line no-param-reassign
  node.type = node.type.toUpperCase() as EditorialSummaryNodeType;

  const children = findChildren(node, nodes).map(child => {
    // eslint-disable-next-line no-param-reassign
    child.type = child.type.toUpperCase() as EditorialSummaryNodeType;

    if (isBlockNode(child)) {
      return <Block key={child.id} {...props} node={child} />;
    } else if (child.type === 'LINK' && child.sourceUrl) {
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
        {child.type === 'EMPHASIS' ? <em>{child.text}</em> : child.text}
        {ref ? (
          <a id={ref.nodeId} onClick={onSourceClick} href={`#${ref.sourceId}`}>
            <sup>{ref.number}</sup>
          </a>
        ) : null}
      </span>
    );
  });

  if (node.type === 'QUOTE') {
    return (
      <Quote key={node.id} size="large">
        {children}
      </Quote>
    );
  } else if (node.type === 'HEADING') {
    return (
      <Typography gutterBottom variant="title" key={node.id}>
        {children}
      </Typography>
    );
  }

  return (
    <Typography variant="body1" paragraph key={node.id}>
      {children}
    </Typography>
  );
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
  if (sourceUrl && type.toUpperCase() !== 'LINK') {
    const number = map.size + 1;
    map.set(node, {
      number,
      sourceId: `source_${number}`,
      nodeId: `ref_${number}`,
      sourceUrl,
      sourceTitle,
    });
  }

  findChildren(node, nodes).forEach(findRefs(nodes, map));
};

type State = {
  shouldShowSources: boolean;
};

export const EditorialSummary = withStyles(styles)(
  class extends React.PureComponent<Props, State> {
    references = new Map<Node, Source>();

    state: State = {
      shouldShowSources: false,
    };

    constructor(props: Props, context: any) {
      super(props, context);

      const { nodes } = props;

      // Collect references in nodes to create the Sources section at the end
      // of the editorial summary.
      nodes.filter(isRootBlock).forEach(findRefs(nodes, this.references));
    }

    onSourceClick: BlockProps['onSourceClick'] = () => {
      this.setState({ shouldShowSources: true });
    };

    toggleSources = () => {
      this.setState(state => ({ shouldShowSources: !state.shouldShowSources }));
    };

    render() {
      const { nodes, author, lastUpdatedOn, classes } = this.props;
      const { shouldShowSources } = this.state;

      const date = lastUpdatedOn ? new Date(lastUpdatedOn) : undefined;

      return (
        <>
          <div className={classes.articleText}>
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
            <footer>
              <Typography color="textSecondary" component="small">
                This article was written by {author}
                {date ? (
                  <time dateTime={date.toISOString()}>
                    {' '}
                    and was last updated on {formatDate(date, 'MMMM D, YYYY')}
                  </time>
                ) : null}.
              </Typography>
            </footer>
          </div>
          <ExpansionPanel
            onChange={this.toggleSources}
            expanded={shouldShowSources}
            elevation={0}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subheading">Sources</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography component="div">
                <small>
                  <ol className={classes.sourceList}>
                    {Array.from(this.references.values()).map(ref => {
                      const { nodeId, sourceId, sourceUrl, sourceTitle } = ref;
                      const prettifiedUrl = prettifyUrl(sourceUrl);

                      return (
                        <li
                          className={classes.sourceListItem}
                          key={nodeId}
                          id={sourceId}
                        >
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
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </>
      );
    }
  },
);
