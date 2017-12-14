import * as React from 'react';
import formatDate from 'date-fns/format';

import * as classes from './EditorialSummary.module.scss';
import { Quote } from 'components/Quote/Quote';
import { prettifyUrl } from 'helpers/prettifyUrl';

type Props = {
  author: string;
  lastUpdatedOn: string | null;
  nodes: Array<{
    text: string | null;
    type: 'heading' | 'break' | 'quote' | 'sentence';
    sourceUrl: string | null;
    sourceTitle: string | null;
  }>;
};

type Source = {
  sourceId: string;
  index: number;
  sourceTitle: string | null;
  refId: string;
};

export class EditorialSummary extends React.PureComponent<Props> {
  render() {
    const { nodes, author, lastUpdatedOn } = this.props;
    const sources = new Map<string, Source>();
    let lastIndex = -1;

    return (
      <div className={classes.root}>
        {nodes.map(({ text, type, sourceUrl, sourceTitle }) => {
          let source;
          if (sourceUrl) {
            source = sources.get(sourceUrl);
            if (!source) {
              lastIndex = lastIndex + 1;
              sources.set(sourceUrl, {
                sourceTitle,
                sourceId: `source_${lastIndex}`,
                refId: `ref_${lastIndex}`,
                index: lastIndex,
              });
              source = sources.get(sourceUrl);
            }
          }

          if (type === 'break') {
            return <div className={classes.break} />;
          } else if (type === 'heading') {
            return <h2>{text}</h2>;
          } else if (type === 'quote') {
            return (
              <Quote size="large" cite={sourceUrl || undefined}>
                {text}
                {source ? (
                  <sup>
                    <a href={`#${source.sourceId}`}>{source.index + 1}</a>
                  </sup>
                ) : null}
              </Quote>
            );
          } else {
            return (
              <span id={source ? source.refId : undefined}>
                {text}
                {source ? (
                  <sup>
                    <a href={`#${source.sourceId}`}>{source.index + 1}</a>
                  </sup>
                ) : null}
              </span>
            );
          }
        })}
        <hr />
        <h3>Sources</h3>
        <small>
          <ol className={classes.sourceList}>
            {Array.from(
              sources.entries(),
            ).map(([sourceUrl, { sourceTitle, refId, sourceId }]) => (
              <li id={sourceId}>
                <a href={sourceUrl}>{sourceTitle}</a> {prettifyUrl(sourceUrl)}
                <a
                  className={classes.backLink}
                  href={`#${refId}`}
                  role="button"
                  aria-label="Go back to reference"
                >
                  ↩
                </a>
              </li>
            ))}
          </ol>
        </small>
        <hr />
        <small>
          This article was written by {author}
          {lastUpdatedOn ? (
            <span>
              {' '}
              and was last updated on{' '}
              {formatDate(new Date(lastUpdatedOn), 'MMMM D, YYYY')}
            </span>
          ) : null}.
        </small>
      </div>
    );
  }
}
