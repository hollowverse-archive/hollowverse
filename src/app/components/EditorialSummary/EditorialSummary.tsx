import * as React from 'react';
import formatDate from 'date-fns/format';

import * as classes from './EditorialSummary.module.scss';
import { prettifyUrl } from 'helpers/prettifyUrl';
import { EditorialSummaryNodeType } from 'api/types';
import { findIndex, memoize, uniqBy } from 'lodash';
import { Quote } from 'components/Quote/Quote';

type Node = {
  id: string;
  parentId: string | null;
  text: string | null;
  type: EditorialSummaryNodeType;
  sourceUrl: string | null;
  sourceTitle: string | null;
};

type Props = {
  author: string;
  lastUpdatedOn: string | null;
  nodes: Node[];
};

const findChildren = (node: Node, nodes: Node[]) => {
  return nodes.filter(child => child.parentId === node.id);
};

const isParent = (node: Node) => {
  return [
    EditorialSummaryNodeType.heading,
    EditorialSummaryNodeType.paragraph,
    EditorialSummaryNodeType.quote,
  ].includes(node.type);
};

export class EditorialSummary extends React.PureComponent<Props> {
  // tslint:disable-next-line:max-func-body-length
  render() {
    const { nodes, author, lastUpdatedOn } = this.props;

    const date = lastUpdatedOn ? new Date(lastUpdatedOn) : undefined;

    const sources = uniqBy(
      nodes.filter(
        node =>
          // Exclude inline links
          node.type !== 'link' && node.sourceUrl !== null,
      ),
      ({ sourceUrl }) => sourceUrl,
    );

    const createRef = memoize(({ sourceUrl, sourceTitle }: Node) => {
      if (!sourceUrl) {
        return null;
      }

      const number = findIndex(sources, { sourceUrl }) + 1;

      return {
        number,
        sourceId: `source_${number}`,
        nodeId: `ref_${number}`,
        sourceUrl,
        sourceTitle,
      };
    });

    const renderBlock = (node: Node): React.ReactNode => {
      const children = findChildren(node, nodes).map(child => {
        if (isParent(child)) {
          return renderBlock(child);
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

        const ref = createRef(child);

        return (
          <span key={child.id}>
            {child.type === 'emphasis' ? <em>{child.text}</em> : child.text}
            {ref ? (
              <a id={ref.nodeId} href={`#${ref.sourceId}`}>
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

    return (
      <div className={classes.root}>
        {nodes.filter(({ parentId }) => parentId === null).map(renderBlock)}
        <hr />
        <h3>Sources</h3>
        <small>
          <ol className={classes.sourceList}>
            {sources.map(node => {
              // tslint:disable-next-line:no-non-null-assertion
              const { nodeId, sourceId, sourceUrl, sourceTitle } = createRef(
                node,
              )!;

              return (
                <li key={sourceUrl} id={sourceId}>
                  <a href={sourceUrl}>{sourceTitle}</a> {prettifyUrl(sourceUrl)}
                  <a
                    className={classes.backLink}
                    href={`#${nodeId}`}
                    role="button"
                    aria-label="Go back to reference"
                  >
                    ↩
                  </a>
                </li>
              );
            })}
          </ol>
        </small>
        <hr />
        <footer>
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
