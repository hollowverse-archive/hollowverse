import * as React from 'react';
import cc from 'classcat';
import formatDate from 'date-fns/format';
import gql from 'graphql-tag';
import { client } from 'api/client';
import { NotablePersonQuery, EditorialSummaryNodeType } from 'api/types';
import { PersonDetails } from 'components/PersonDetails/PersonDetails';
import { FbComments } from 'components/FbComments/FbComments';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';
import { withRouter } from 'react-router-dom';
import { resolve } from 'react-resolver';
import { Result, isErrorResult } from 'helpers/results';

import warningIconUrl from 'icons/warning.svg';

import * as classes from './NotablePerson.module.scss';
import { Card } from 'components/Card/Card';
import { Quote } from 'components/Quote/Quote';
import { prettifyUrl } from 'helpers/prettifyUrl';

const warningIcon = <SvgIcon url={warningIconUrl} size={100} />;

const reload = () => {
  location.reload();
};

const query = gql`
  query NotablePerson($slug: String!) {
    notablePerson(slug: $slug) {
      name
      photoUrl
      summary
      commentsUrl
      editorialSummary {
        author
        lastUpdatedOn
        nodes {
          text
          type
          sourceUrl
          sourceTitle
        }
      }
    }
  }
`;

type OwnProps = {};
type ResolvedProps = {
  queryResult: Result<NotablePersonQuery>;
};

class Page extends React.PureComponent<OwnProps & ResolvedProps> {
  // tslint:disable-next-line:max-func-body-length
  render() {
    const { queryResult } = this.props;
    if (isErrorResult(queryResult)) {
      return (
        <MessageWithIcon
          caption="Are you connected to the internet?"
          description="Please check your connection and try again"
          actionText="Retry"
          icon={warningIcon}
          onActionClick={reload}
        />
      );
    }

    const { data } = queryResult;
    if (!data.notablePerson) {
      return (
        <MessageWithIcon
          caption="Not Found"
          description="We do not have a page for this notable person"
          icon={warningIcon}
        />
      );
    } else {
      const { notablePerson } = data;
      const {
        name,
        photoUrl,
        summary,
        commentsUrl,
        editorialSummary,
      } = notablePerson;

      const sources = new Map<
        string,
        { index: number; sourceTitle: string | null; ref: string }
      >();
      let lastIndex = -1;

      return (
        <div>
          <PersonDetails name={name} photoUrl={photoUrl} summary={summary} />
          {editorialSummary ? (
            <Card className={cc([classes.card, classes.editorialSummary])}>
              {editorialSummary.nodes.map(
                ({ text, type, sourceUrl, sourceTitle }) => {
                  let source;
                  if (sourceUrl) {
                    source = sources.get(sourceUrl);
                    if (!source) {
                      lastIndex = lastIndex + 1;
                      sources.set(sourceUrl, {
                        index: lastIndex,
                        sourceTitle,
                        ref: `ref_${lastIndex}`,
                      });
                      source = sources.get(sourceUrl);
                    }
                  }

                  if (type === EditorialSummaryNodeType.break) {
                    return <br />;
                  } else if (type === EditorialSummaryNodeType.heading) {
                    return <h2>{text}</h2>;
                  } else if (type === EditorialSummaryNodeType.quote) {
                    return (
                      <Quote size="large" cite={sourceUrl || undefined}>
                        {text}
                        {source ? (
                          <sup>
                            <a href={`#source_${source.index}`}>
                              {source.index + 1}
                            </a>
                          </sup>
                        ) : null}
                      </Quote>
                    );
                  } else {
                    return (
                      <span id={source ? source.ref : undefined}>
                        {text}
                        {source ? (
                          <sup>
                            <a href={`#source_${source.index}`}>
                              {source.index + 1}
                            </a>
                          </sup>
                        ) : null}
                      </span>
                    );
                  }
                },
              )}
              <hr />
              <h3>Sources</h3>
              <small>
                <ol className={classes.sourceList}>
                  {Array.from(
                    sources.entries(),
                  ).map(([sourceUrl, { sourceTitle, ref, index }]) => (
                    <li id={`source_${index}`}>
                      <a href={sourceUrl}>{sourceTitle}</a>{' '}
                      {prettifyUrl(sourceUrl)}
                      <a
                        className={classes.backLink}
                        href={`#${ref}`}
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
                This article was written by {editorialSummary.author}
                {editorialSummary.lastUpdatedOn ? (
                  <span>
                    {' '}
                    and was last updated on{' '}
                    {formatDate(
                      new Date(editorialSummary.lastUpdatedOn),
                      'MMMM D, YYYY',
                    )}
                  </span>
                ) : null}.
              </small>
            </Card>
          ) : null}
          <OptionalIntersectionObserver rootMargin="0% 0% 25% 0%" triggerOnce>
            {inView => {
              if (inView) {
                return (
                  <Card className={cc([classes.card, classes.comments])}>
                    <FbComments url={commentsUrl} />
                  </Card>
                );
              } else {
                return null;
              }
            }}
          </OptionalIntersectionObserver>
        </div>
      );
    }
  }
}

const ResolvedPage = resolve('queryResult', async ({ slug }) => {
  try {
    const data = await client.request<NotablePersonQuery>(query, { slug });

    return {
      data,
    };
  } catch (error) {
    return {
      error,
    };
  }
})(Page);

export const NotablePerson = withRouter(({ match: { params: { slug } } }) => (
  <ResolvedPage slug={slug} />
));
