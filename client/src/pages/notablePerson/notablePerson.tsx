import * as React from 'react';
import gql from 'graphql-tag';
import { client } from 'api/client';
import { NotablePersonQuery } from 'api/types';
import { Event } from 'components/Event';
import { PersonDetails } from 'components/PersonDetails';
import { FbComments } from 'components/FbComments';
import { MessageWithIcon } from 'components/MessageWithIcon';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { SvgIcon } from 'components/SvgIcon';
import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver';
import { withRouter } from 'react-router-dom';
import Loadable from 'react-loadable';

import { prettifyUrl } from 'helpers/url';

import warningIconSymbol from 'icons/warning.svg';

const warningIcon = <SvgIcon {...warningIconSymbol} size={100} />;

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

const createPageWithData = (data: NotablePersonQuery) => () => {
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
              return (
                <FbComments url={commentsUrl}>
                  <MessageWithIcon
                    caption="Loading Facebook comments..."
                    icon={<LoadingSpinner size={50} />}
                  />
                </FbComments>
              );
            } else {
              return null;
            }
          }}
        </OptionalIntersectionObserver>
      </div>
    );
  }
};

const createLoadablePage = ({ slug }: { slug: string }) =>
  Loadable({
    async loader() {
      const data = await client.request<NotablePersonQuery>(query, { slug });

      return createPageWithData(data);
    },

    loading(props) {
      if (props.error) {
        return (
          <MessageWithIcon
            caption="Are you connected to the internet?"
            description="Please check that you are connected to the internet and try again"
            actionText="Retry"
            onActionClick={reload}
            icon={warningIcon}
          />
        );
      }

      return <div>Loading...</div>;
    },
  });

export default withRouter(({ match: { params: { slug } } }) => {
  const LoadablePage = createLoadablePage({ slug });

  return <LoadablePage />;
});
