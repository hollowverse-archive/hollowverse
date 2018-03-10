import React from 'react';
import cc from 'classcat';
import Helmet from 'react-helmet-async';

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

    renderError = () => (
      <>
        <Helmet>
          <title>Error loading notable person page</title>
        </Helmet>
        <Status code={500} />
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

    renderRelatedPeople = (notablePerson: NotablePersonType) => {
      const { relatedPeople } = notablePerson!; // tslint:disable-line:no-non-null-assertion

      return relatedPeople.length ? (
        <div className={classes.relatedPeople}>
          <h2>Other interesting profiles</h2>
          <RelatedPeople people={relatedPeople} />
        </div>
      ) : null;
    };

    renderFbComments = (notablePerson: NotablePersonType) => {
      const { commentsUrl } = notablePerson!; // tslint:disable-line:no-non-null-assertion

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

    renderEditorialSummary = (notablePerson: NotablePersonType) => {
      const { editorialSummary, slug, name } = notablePerson!; // tslint:disable-line:no-non-null-assertion

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

    renderBody = (notablePerson?: NotablePersonType) => {
      if (notablePerson === undefined) {
        return <NotablePersonBody />;
      } else if (notablePerson === null) {
        return null;
      }

      return (
        <>
          <NotablePersonBody
            notablePerson={notablePerson}
            editorialSummary={this.renderEditorialSummary(notablePerson)}
          />

          {this.renderRelatedPeople(notablePerson)}
          {this.renderFbComments(notablePerson)}
        </>
      );
    };

    renderContent = (result: Result) => {
      const notablePerson = result.value && result.value.notablePerson;
      const isLoading = result.value === null || isPendingResult(result);

      if (isLoading) {
        return (
          <>
            <Helmet>
              <title>Loading notable person...</title>
            </Helmet>
            {this.renderBody()}
          </>
        );
      } else if (notablePerson) {
        const { slug, name, commentsUrl } = notablePerson;
        const isWhitelisted = isWhitelistedPage(`/${slug}`);

        return (
          <>
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
            </Helmet>
            <Status code={200} />
            <DispatchOnLifecycleEvent
              onWillUnmount={setAlternativeSearchBoxText(null)}
              onWillMount={setAlternativeSearchBoxText(name)}
            />

            {this.renderBody(notablePerson)}
          </>
        );
      }

      return (
        <>
          <Helmet>
            <title>Page not found</title>
          </Helmet>
          <Status code={404} />
          <MessageWithIcon title="Not Found" icon={warningIcon} />
        </>
      );
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
                        ? this.renderError()
                        : this.renderContent(result)}
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
