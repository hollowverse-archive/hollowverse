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
import { withRouter, RouteComponentProps } from 'react-router';
import { resolve } from 'react-resolver';
import {
  AsyncResult,
  promiseToAsyncResult,
  isErrorResult,
  isPendingResult,
} from 'helpers/asyncResults';

import warningIcon from 'icons/warning.svg';

import * as classes from './NotablePerson.module.scss';
import { Card } from 'components/Card/Card';
import { EditorialSummary } from 'components/EditorialSummary/EditorialSummary';
import { Status } from 'components/Status/Status';
import { connect } from 'react-redux';
import { setLastSearchMatch } from 'store/features/search/actions';

const warningIconComponent = <SvgIcon {...warningIcon} size={100} />;

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
      editorialSummary {
        author
        lastUpdatedOn
        nodes {
          text
          type
          sourceUrl
          sourceTitle
        }
      }
    }
  }
`;

type OwnProps = {
  setLastSearchMatch(term: string): any;
} & RouteComponentProps<{ slug: string }>;

type ResolvableProps = {
  queryResult: AsyncResult<NotablePersonQuery>;
};

class Page extends React.PureComponent<OwnProps & ResolvableProps> {
  render() {
    const { queryResult } = this.props;
    if (isErrorResult(queryResult)) {
      return (
        <Status code={500}>
          <MessageWithIcon
            caption="Are you connected to the internet?"
            description="Please check your connection and try again"
            actionText="Retry"
            icon={warningIconComponent}
            onActionClick={reload}
          />
        </Status>
      );
    }

    if (isPendingResult(queryResult)) {
      // @TODO
      return <div>Loading...</div>;
    }

    const { value } = queryResult;
    if (!value.notablePerson) {
      return (
        <Status code={404}>
          <MessageWithIcon caption="Not Found" icon={warningIconComponent} />
        </Status>
      );
    } else {
      const { notablePerson } = value;
      const {
        name,
        photoUrl,
        summary,
        commentsUrl,
        editorialSummary,
      } = notablePerson;

      return (
        <div className={classes.root}>
          <article className={classes.article}>
            <PersonDetails name={name} photoUrl={photoUrl} summary={summary} />
            {editorialSummary ? (
              <Card className={cc([classes.card, classes.editorialSummary])}>
                <EditorialSummary {...editorialSummary} />
              </Card>
            ) : null}
          </article>
          <OptionalIntersectionObserver rootMargin="0% 0% 25% 0%" triggerOnce>
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
    }
  }
}

const ResolvedPage = resolve<OwnProps, ResolvableProps>({
  queryResult: async ({ match: { params: { slug } }, ...props }) => {
    const promise = client.request<NotablePersonQuery>(query, { slug });
    const { notablePerson } = await promise;
    if (notablePerson) {
      props.setLastSearchMatch(notablePerson.name);
    }

    return promiseToAsyncResult(promise);
  },
})(Page as any);

const ConnectedResolvedPage = connect(undefined, { setLastSearchMatch })(
  ResolvedPage,
);

export const NotablePerson = withRouter(ConnectedResolvedPage);
