import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { NotablePersonQuery } from '../../../graphqlOperationResultTypes';
import Event from 'components/Event';
import PersonDetails from 'components/PersonDetails';

export default graphql<NotablePersonQuery>(gql`
  query NotablePerson {
    notablePerson(slug: "Tom_Hanks") {
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
          id
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
`)(({ data }) => {
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
            sourceName={new URL(event.sourceUrl).hostname.replace(
              /^www\./i,
              '',
            )}
          />
        ))}
      </div>
    );
  }

  return <div>Loading...</div>;
});
