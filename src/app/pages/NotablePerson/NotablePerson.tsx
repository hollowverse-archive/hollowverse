import * as React from 'react';
import cc from 'classcat';
import gql from 'graphql-tag';
import { client } from 'api/client';
import { NotablePersonQuery } from 'api/types';
import { PersonDetails } from 'components/PersonDetails/PersonDetails';
import { FbComments } from 'components/FbComments/FbComments';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';

import warningIcon from 'icons/warning.svg';

import * as classes from './NotablePerson.module.scss';
import { Card } from 'components/Card/Card';
import { EditorialSummary } from 'components/EditorialSummary/EditorialSummary';
import { Status } from 'components/Status/Status';
import {
  isErrorResult,
  isPendingResult,
  AsyncResult,
} from 'helpers/asyncResults';
import { ResolvableComponent } from 'hocs/ResolvableComponent/ResolvableComponent';

const warningIconComponent = <SvgIcon {...warningIcon} size={100} />;

const reload = () => {
  location.reload();
};

const query = gql`
  query NotablePerson($slug: String!) {
    notablePerson(slug: $slug) {
      name
      slug
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

export type Props = { slug: string };

class Page extends React.Component<Props> {
  load = async () => {
    const { slug } = this.props;

    return client.request<NotablePersonQuery>(query, { slug });
  };

  render() {
    return (
      <div key={this.props.slug}>
        <ResolvableComponent
          requestId={this.props.slug}
          dataKey="notablePersonQuery"
          resolve={this.load}
        >
          {({ result }: { result: AsyncResult<NotablePersonQuery> }) => {
            if (isPendingResult(result)) {
              return <div>Loading NP page...</div>;
            }

            if (isErrorResult(result) || !result.value) {
              return (
                <MessageWithIcon
                  caption="Are you connected to the internet?"
                  description="Please check your connection and try again"
                  actionText="Retry"
                  icon={warningIconComponent}
                  onActionClick={reload}
                >
                  <Status code={500} />
                </MessageWithIcon>
              );
            }

            const { notablePerson } = result.value;

            if (!notablePerson) {
              return (
                <MessageWithIcon
                  caption="Not Found"
                  icon={warningIconComponent}
                >
                  <Status code={404} />
                </MessageWithIcon>
              );
            }

            const {
              name,
              photoUrl,
              summary,
              commentsUrl,
              editorialSummary,
            } = notablePerson;

            return (
              <div className={classes.root}>
                <Status code={200} />
                <article className={classes.article}>
                  <PersonDetails
                    name={name}
                    photoUrl={photoUrl}
                    summary={summary}
                  />
                  {editorialSummary ? (
                    <Card
                      className={cc([classes.card, classes.editorialSummary])}
                    >
                      <EditorialSummary {...editorialSummary} />
                    </Card>
                  ) : null}
                </article>
                <OptionalIntersectionObserver
                  rootMargin="0% 0% 25% 0%"
                  triggerOnce
                >
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
          }}
        </ResolvableComponent>
      </div>
    );
  }
}

export const NotablePerson = Page;
