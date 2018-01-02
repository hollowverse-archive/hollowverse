import * as React from 'react';
import cc from 'classcat';
import { client } from 'api/client';

import {
  isErrorResult,
  isPendingResult,
  AsyncResult,
} from 'helpers/asyncResults';

import { NotablePersonQuery } from 'api/types';
import { PersonDetails } from 'components/PersonDetails/PersonDetails';
import { FbComments } from 'components/FbComments/FbComments';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';
import { Card } from 'components/Card/Card';
import { EditorialSummary } from 'components/EditorialSummary/EditorialSummary';
import { NotablePersonSkeleton } from './NotablePersonSkeleton';
import { Status } from 'components/Status/Status';
import { WithData } from 'hocs/WithData/WithData';
import { LinkButton } from 'components/Button/Button';
import { RelatedPeople } from './RelatedPeople';
import { withRouter, RouteComponentProps } from 'react-router';
import { forceReload } from 'helpers/forceReload';

import * as classes from './NotablePerson.module.scss';
import query from './NotablePersonQuery.graphql';

import warningIcon from 'icons/warning.svg';

const warningIconComponent = <SvgIcon {...warningIcon} size={100} />;

export type Props = { slug: string };

const Page = withRouter(
  class extends React.Component<Props & RouteComponentProps<any>> {
    load = async () => {
      const { slug } = this.props;

      return client.request<NotablePersonQuery>(query, { slug });
    };

    render() {
      return (
        <WithData
          requestId={this.props.slug}
          dataKey="notablePersonQuery"
          load={this.load}
        >
          {({ result }: { result: AsyncResult<NotablePersonQuery> }) => {
            if (isPendingResult(result)) {
              return <NotablePersonSkeleton />;
            }

            if (isErrorResult(result) || !result.value) {
              const { location } = this.props;

              return (
                <MessageWithIcon
                  title="Are you connected to the internet?"
                  description="Please check your connection and try again"
                  button={
                    <LinkButton to={location} onClick={forceReload}>
                      Reload
                    </LinkButton>
                  }
                  icon={warningIconComponent}
                >
                  <Status code={500} />
                </MessageWithIcon>
              );
            }

            const { notablePerson } = result.value;

            if (!notablePerson) {
              return (
                <MessageWithIcon title="Not Found" icon={warningIconComponent}>
                  <Status code={404} />
                </MessageWithIcon>
              );
            }

            const {
              name,
              mainPhoto,
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
                    photo={mainPhoto}
                    summary={summary}
                  />
                  {editorialSummary ? (
                    <Card
                      className={cc([classes.card, classes.editorialSummary])}
                    >
                      <EditorialSummary {...editorialSummary} />
                    </Card>
                  ) : (
                    <div className={classes.stub}>
                      Share what you know about the religion and political views
                      of {name} in the comments below
                    </div>
                  )}
                </article>
                {notablePerson.relatedPeople.length ? (
                  <div className={classes.relatedPeople}>
                    <h2>Other interseting profiles</h2>
                    <RelatedPeople people={notablePerson.relatedPeople} />
                  </div>
                ) : null}
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
        </WithData>
      );
    }
  },
);

export const NotablePerson = Page;
