import * as React from 'react';
import gql from 'graphql-tag';
import { client } from 'api/client';
import { NotablePersonQuery } from 'api/types';
import { Event } from 'components/Event/Event';
import { PersonDetails } from 'components/PersonDetails/PersonDetails';
import { FbComments } from 'components/FbComments/FbComments';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';
import { withRouter } from 'react-router-dom';
import { resolve } from 'react-resolver';
import { Result, isErrorResult } from 'helpers/results';
import { Card } from 'components/Card/Card';
import { Quote } from 'components/Quote/Quote';

import { prettifyUrl } from 'helpers/prettifyUrl';

import warningIconUrl from 'icons/warning.svg';

const warningIcon = <SvgIcon url={warningIconUrl} size={100} />;

const reload = () => {
  location.reload();
};

const query = gql`
  fragment commonEventProps on NotablePersonEvent {
    id
    type
    quote
    isQuoteByNotablePerson
    labels {
      id
      text
    }
    sourceUrl
    postedAt
    happenedOn
  }

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
      quotes: events(query: { type: quote }) {
        ...commonEventProps
      }
      donations: events(query: { type: donation }) {
        ...commonEventProps
        entityUrl
        entityName
      }
    }
  }
`;

type OwnProps = {};
type ResolvedProps = {
  queryResult: Result<NotablePersonQuery>;
};

class NotablePersonPage extends React.PureComponent<OwnProps & ResolvedProps> {
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
        quotes,
        donations,
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
          <Card title={<h2>Quotes</h2>} subtitle={name} moreLink="./quotes">
            {quotes.map(quote => (
              <li key={quote.id}>
                <Event
                  {...quote}
                  notablePerson={notablePerson}
                  postedAt={new Date(quote.postedAt)}
                  happenedOn={
                    quote.happenedOn ? new Date(quote.happenedOn) : null
                  }
                  sourceName={prettifyUrl(quote.sourceUrl)}
                  labels={quote.labels}
                >
                  {quote.quote ? (
                    <Quote photoUrl={photoUrl}>{quote.quote}</Quote>
                  ) : null}
                </Event>
              </li>
            ))}
          </Card>

          <Card title={<h2>Donations</h2>} subtitle={name} moreLink="./quotes">
            {donations.map(donation => (
              <li key={donation.id}>
                <Event
                  {...donation}
                  notablePerson={notablePerson}
                  postedAt={new Date(donation.postedAt)}
                  happenedOn={
                    donation.happenedOn ? new Date(donation.happenedOn) : null
                  }
                  sourceName={prettifyUrl(donation.sourceUrl)}
                  labels={donation.labels}
                >
                  <h3>{donation.entityName}</h3>
                  {donation.quote ? (
                    <Quote photoUrl={photoUrl}>{donation.quote}</Quote>
                  ) : null}
                </Event>
              </li>
            ))}
          </Card>
          <OptionalIntersectionObserver rootMargin="0% 0% 25% 0%" triggerOnce>
            {inView => {
              if (inView) {
                return <FbComments url={commentsUrl} />;
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
})(NotablePersonPage);

export default withRouter(({ match: { params: { slug } } }) => (
  <ResolvedPage slug={slug} />
));
