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
import { ResolvableComponent } from 'hocs/ResolvableComponent/ResolvableComponent';
import { Status } from 'components/Status/Status';
import {
  isErrorResult,
  isPendingResult,
  AsyncResult,
} from 'helpers/asyncResults';

const warningIconComponent = <SvgIcon {...warningIcon} size={100} />;

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

export type Props = { slug: string };

class Page extends React.PureComponent<Props> {
  load = async () => {
    const { slug } = this.props;

    return client.request<NotablePersonQuery>(query, { slug });
  };

  render() {
    return (
      <ResolvableComponent load={this.load}>
        {({ result }: { result: AsyncResult<NotablePersonQuery> }) => {
          if (isPendingResult(result)) {
            return <div>Loading NP page...</div>;
          }

          if (isErrorResult(result) || !result.value) {
            return (
              <Status code={500}>
                <MessageWithIcon
                  caption="Are you connected to the internet?"
                  description="Please check your connection and try again"
                  actionText="Retry"
                  icon={warningIconComponent}
                  onActionClick={reload}
                />
              </Status>
            );
          }

          const { notablePerson } = result.value;

          if (!notablePerson) {
            return (
              <Status code={404}>
                <MessageWithIcon
                  caption="Not Found"
                  icon={warningIconComponent}
                />
              </Status>
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
    );
  }
}

export const NotablePerson = Page;
