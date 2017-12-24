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
import { NotablePersonSkeleton } from './NotablePersonSkeleton';
import { Status } from 'components/Status/Status';
import {
  isErrorResult,
  isPendingResult,
  AsyncResult,
} from 'helpers/asyncResults';
import { WithData } from 'hocs/WithData/WithData';
import { LinkButton } from 'components/Button/Button';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

const warningIconComponent = <SvgIcon {...warningIcon} size={100} />;

const query = gql`
  query NotablePerson($slug: String!) {
    notablePerson(slug: $slug) {
      name
      slug
      photoUrl
      summary
      commentsUrl
      relatedPeople {
        slug
        name
        photoUrl
      }
      editorialSummary {
        author
        lastUpdatedOn
        nodes {
          id
          parentId
          text
          type
          sourceUrl
          sourceTitle
        }
      }
    }
  }
`;

const forceReload = () => {
  window.location.reload();
};

export type Props = { slug: string };

const Page = withRouter(
  class extends React.Component<Props & RouteComponentProps<any>> {
    load = async () => {
      const { slug } = this.props;

      return client.request<NotablePersonQuery>(query, { slug });
    };

    // tslint:disable-next-line:max-func-body-length
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
                {notablePerson.relatedPeople.length ? (
                  <div>
                    <h2>Other interseting profiles</h2>
                    {notablePerson.relatedPeople.map(person => (
                      <Link to={`/${person.slug}`}>
                        {person.photoUrl ? (
                          <img alt={person.name} src={person.photoUrl} />
                        ) : null}
                        {person.name}
                      </Link>
                    ))}
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
