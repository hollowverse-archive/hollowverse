import React from 'react';
import cc from 'classcat';
import Helmet from 'react-helmet-async';
import { oneLine } from 'common-tags';

import {
  isErrorResult,
  isPendingResult,
  AsyncResult,
} from 'helpers/asyncResults';

import { NotablePersonQuery } from 'api/types';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { Status } from 'components/Status/Status';
import { WithData } from 'hocs/WithData/WithData';
import { LinkButton } from 'components/Button/Button';
import { withRouter, RouteComponentProps } from 'react-router';
import { forceReload } from 'helpers/forceReload';
import query from './NotablePersonQuery.graphql';
import { FbComments } from 'components/FbComments/FbComments';
import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';
import { Card } from 'components/Card/Card';
import { EditorialSummary } from 'components/EditorialSummary/EditorialSummary';
import { RelatedPeople } from './RelatedPeople';
import { DispatchOnLifecycleEvent } from 'components/DispatchOnLifecycleEvent/DispatchOnLifecycleEvent';
import { NotablePersonBody } from './NotablePersonBody';

import {
  AppDependenciesContext,
  AppDependencies,
} from 'appDependenciesContext';
import { warningIcon } from './warningIcon';

import classes from './NotablePerson.module.scss';

import { setAlternativeSearchBoxText } from 'store/features/search/actions';
import { isWhitelistedPage } from 'redirectionMap';

export type Props = {};
type NotablePersonType = NotablePersonQuery['notablePerson'];
type Result = AsyncResult<NotablePersonQuery | null>;

const Page = withRouter(
  class extends React.Component<Props & RouteComponentProps<any>> {
    createLoad = ({
      apiClient,
    }: Pick<AppDependencies, 'apiClient'>) => async () => {
      const { slug } = this.props.match.params;

      return apiClient.request<NotablePersonQuery>(query, { slug });
    };

    renderRelatedPeople = (notablePerson: NonNullable<NotablePersonType>) => {
      const { relatedPeople } = notablePerson;

      return relatedPeople.length ? (
        <div className={classes.relatedPeople}>
          <h2>Other interesting profiles</h2>
          <RelatedPeople people={relatedPeople} />
        </div>
      ) : null;
    };

    renderFbComments = (notablePerson: NonNullable<NotablePersonType>) => {
      const { commentsUrl } = notablePerson;

      return (
        <OptionalIntersectionObserver rootMargin="0% 0% 25% 0%" triggerOnce>
          {inView =>
            inView ? (
              <Card className={cc([classes.card, classes.comments])}>
                <FbComments url={commentsUrl} />
              </Card>
            ) : null
          }
        </OptionalIntersectionObserver>
      );
    };

    renderEditorialSummary = (
      notablePerson: NonNullable<NotablePersonType>,
    ) => {
      const { editorialSummary, slug, name } = notablePerson;

      return editorialSummary ? (
        <Card className={cc([classes.card, classes.editorialSummary])}>
          <EditorialSummary id={slug} {...editorialSummary} />
        </Card>
      ) : (
        <div className={classes.stub}>
          Share what you know about the religion and political views of {name}{' '}
          in the comments below
        </div>
      );
    };

    renderErrorStatus = () => (
      <>
        <Status code={500} />
        <Helmet>
          <title>Error loading notable person page</title>
        </Helmet>
        <MessageWithIcon
          title="Are you connected to the internet?"
          description="Please check your connection and try again"
          button={
            <LinkButton to={this.props.location} onClick={forceReload}>
              Reload
            </LinkButton>
          }
          icon={warningIcon}
        />
      </>
    );

    render200Status = (notablePerson: NonNullable<NotablePersonType>) => {
      const { slug, name, commentsUrl } = notablePerson;
      const isWhitelisted = isWhitelistedPage(`/${slug}`);

      return (
        <>
          <Status code={200} />
          <Helmet>
            <link
              rel="canonical"
              href={
                isWhitelisted
                  ? String(new URL(`${slug}`, 'https://hollowverse.com'))
                  : commentsUrl
              }
            />
            <title>{name}'s Religion and Political Views</title>
            <meta
              name="description"
              content={oneLine`
                Quotes, news, and discussions about ${name}'s
                philosophy, politics, and ideas
              `}
            />
          </Helmet>
          <DispatchOnLifecycleEvent
            onWillUnmount={setAlternativeSearchBoxText(null)}
            onWillMount={setAlternativeSearchBoxText(name)}
          />
          <NotablePersonBody
            notablePerson={notablePerson}
            editorialSummary={this.renderEditorialSummary(notablePerson)}
          />
          {this.renderRelatedPeople(notablePerson)}
          {this.renderFbComments(notablePerson)}
        </>
      );
    };

    render404Status = () => (
      <>
        <Status code={404} />
        <Helmet>
          <title>Page not found</title>
        </Helmet>
        <MessageWithIcon title="Not Found" icon={warningIcon} />
      </>
    );

    renderNonErrorStatus = (result: Result) => {
      const notablePerson = result.value && result.value.notablePerson;
      const isLoading = result.value === null || isPendingResult(result);

      if (isLoading) {
        return <NotablePersonBody />;
      } else if (notablePerson) {
        return this.render200Status(notablePerson);
      }

      return this.render404Status();
    };

    render() {
      const pageUrl = this.props.history.createHref(this.props.location);
      const { slug } = this.props.match.params;

      return (
        <AppDependenciesContext.Consumer>
          {dependencies => {
            return (
              <WithData
                requestId={slug}
                dataKey="notablePersonQuery"
                forPage={pageUrl}
                load={this.createLoad(dependencies)}
              >
                {({ result }: { result: Result }) => {
                  return (
                    <div className={classes.root}>
                      {isErrorResult(result)
                        ? this.renderErrorStatus()
                        : this.renderNonErrorStatus(result)}
                    </div>
                  );
                }}
              </WithData>
            );
          }}
        </AppDependenciesContext.Consumer>
      );
    }
  },
);

export const NotablePerson = Page;
