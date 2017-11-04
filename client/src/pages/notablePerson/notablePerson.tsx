import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { NotablePersonQuery } from '../../../graphqlOperationResultTypes';
import Event from 'components/Event';
import PersonDetails from 'components/PersonDetails';

import { prettifyUrl } from 'helpers/url';

export default graphql<NotablePersonQuery>(
  gql`
    query NotablePerson($slug: String!) {
      notablePerson(slug: $slug) {
        name
        photoUrl
        summary
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
  if (!data || data.error || data.notablePerson === null) {
    return <div>Error loading</div>;
  }

  if (data && data.notablePerson) {
    const { notablePerson } = data;
    const { name, photoUrl, events, labels, summary } = notablePerson;

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
      </div>
    );
  }

  return <div>Loading...</div>;
});
