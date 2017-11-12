import * as React from 'react';
import gql from 'graphql-tag';
import { client } from 'api/client';
import { NotablePersonQuery } from 'api/types';
import { Event } from 'components/Event';
import { PersonDetails } from 'components/PersonDetails';
import { FbComments } from 'components/FbComments';
import { MessageWithIcon } from 'components/MessageWithIcon';
// import { SvgIcon } from 'components/SvgIcon';
import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver';
import { withRouter } from 'react-router-dom';
import * as Resolver from 'react-resolver';

import { prettifyUrl } from 'helpers/url';

// import warningIconSymbol from 'icons/warning.svg';

// const warningIcon = <SvgIcon {...warningIconSymbol} size={100} />;

// const reload = () => {
//   location.reload();
// };

const query = gql`
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
      }
    }
  }
`;

class Page extends React.Component<any, any> {
  render() {
    const { data } = this.props;
    if (!data) {
      return null;
    }
    if (!data.notablePerson) {
      return (
        <MessageWithIcon
          caption="Not Found"
          description="We do not have a page for this notable person"
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
          {events.map((event: any) => (
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

const ResolvedPage = Resolver.resolve('data', async ({ slug }: any) => {
  return client.request<NotablePersonQuery>(query, { slug });
})(Page);

export default withRouter(({ match: { params: { slug } } }) => (
  <ResolvedPage slug={slug} />
));
