import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { NotablePersonQuery } from '../../../graphqlOperationResultTypes';
import { Event } from 'components/Event';
import { PersonDetails } from 'components/PersonDetails';
import { LoadableFbComments } from 'components/FbComments/loadable';
import { MessageWithIcon } from 'components/MessageWithIcon';
import { SvgIcon } from 'components/SvgIcon';
import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver';

import { prettifyUrl } from 'helpers/url';

import warningIconSymbol from 'icons/warning.svg';

const warningIcon = <SvgIcon {...warningIconSymbol} size={100} />;

const reload = () => {
  location.reload();
};

export default graphql<NotablePersonQuery>(
  gql`
    query NotablePerson($slug: String!) {
      notablePerson(slug: $slug) {
        name
        photoUrl
        summary
        commentsUrl
        labels {
          id
          text
        }
        events {
          id
          quote
          postedAt
          happenedOn
          isQuoteByNotablePerson
          sourceUrl
          comments {
            owner {
              id
              name
              photoUrl
            }
            text
          }
        }
      }
    }
  `,
  {
    options: ({ match: { params: { slug } } }: any) => ({
      variables: { slug },
    }),
  },
)(({ data }) => {
  if (!data) {
    return (
      <MessageWithIcon
        caption="Oops!"
        description="Something's wrong on our end. Please try again later."
        actionText="Retry"
        onActionClick={reload}
        icon={warningIcon}
      />
    );
  } else if (data && data.loading) {
    return <div>Loading...</div>;
  } else if (data.error && data.error.networkError) {
    return (
      <MessageWithIcon
        caption="Are you connected to the internet?"
        description="Please check that you are connected to the internet and try again"
        actionText="Retry"
        onActionClick={reload}
        icon={warningIcon}
      />
    );
  } else if (data.error) {
    return (
      <MessageWithIcon
        caption={data.error.name}
        description={data.error.message}
        actionText="Retry"
        onActionClick={reload}
        icon={warningIcon}
      />
    );
  } else if (!data.notablePerson) {
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
      events,
      labels,
      summary,
      commentsUrl,
    } = notablePerson;

    return (
      <div>
        <PersonDetails
          name={name}
          labels={labels}
          photoUrl={photoUrl}
          summary={summary}
        />
        {events.map(event => (
          <Event
            key={event.id}
            {...event}
            notablePerson={notablePerson}
            postedAt={new Date(event.postedAt)}
            happenedOn={event.happenedOn ? new Date(event.happenedOn) : null}
            sourceName={prettifyUrl(event.sourceUrl)}
          />
        ))}
        <OptionalIntersectionObserver rootMargin="0% 0% 25% 0%" triggerOnce>
          {inView => {
            if (inView) {
              return <LoadableFbComments url={commentsUrl} />;
            } else {
              return null;
            }
          }}
        </OptionalIntersectionObserver>
      </div>
    );
  }
});
