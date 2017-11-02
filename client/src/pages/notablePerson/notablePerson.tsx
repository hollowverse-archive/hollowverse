import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { NotablePersonQuery } from '../../../graphqlOperationResultTypes';

export default graphql<NotablePersonQuery>(gql`
  query NotablePerson {
    notablePerson(slug: "Tom_Hanks") {
      name
      photoUrl
      events {
        id
        quote
      }
    }
  }
`)(({ data }) => {
  if (data && data.notablePerson) {
    const { name, photoUrl, events } = data.notablePerson;

    return (
      <div>
        <img alt={name} src={photoUrl} />
        <h2>{name}</h2>
        {events.map(event => <li key={event.id}>{event.quote}</li>)}
      </div>
    );
  }

  return <div>Loading...</div>;
});
