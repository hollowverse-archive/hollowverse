import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { NotablePersonQuery } from '../../../graphqlOperationResultTypes';
import { Event } from 'components/Event';
import { PersonDetails } from 'components/PersonDetails';
import { LoadableFbComments } from 'components/FbComments/loadable';
import { MessageWithIcon } from 'components/MessageWithIcon';
import { SvgIcon } from 'components/SvgIcon';

import warningIcon from 'icons/warning.svg';

import { prettifyUrl } from 'helpers/url';

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
  if (data === undefined) {
    return <div>What?</div>;
  } else if (data.error) {
    return (
      <MessageWithIcon
        caption={data.error.name}
        description={data.error.message}
        icon={<SvgIcon {...warningIcon} size={100} />}
      />
    );
  } else if (data.loading) {
    // @TODO
  } else if (data && data.notablePerson) {
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
        <LoadableFbComments url={commentsUrl} />
      </div>
    );
  }
});
