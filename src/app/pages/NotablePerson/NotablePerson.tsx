import React from 'react';
import cc from 'classcat';
import Helmet from 'react-helmet-async';
import { oneLine } from 'common-tags';

import {
  isErrorResult,
  AsyncResult,
  isSuccessResult,
  ErrorResult,
} from 'helpers/asyncResults';
import IntersectionObserver from 'react-intersection-observer';

import { NotablePersonQuery } from 'api/types';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { Status } from 'components/Status/Status';
import { WithData } from 'hocs/WithData/WithData';
import { LinkButton } from 'components/Button/Button';
import { withRouter, RouteComponentProps } from 'react-router';
import { forceReload } from 'helpers/forceReload';
import query from './NotablePersonQuery.graphql';
import { FbComments } from 'components/FbComments/FbComments';
import { EditorialSummary } from 'components/EditorialSummary/EditorialSummary';
import { RelatedPeople } from './RelatedPeople';
import { DispatchOnLifecycleEvent } from 'components/DispatchOnLifecycleEvent/DispatchOnLifecycleEvent';
import { NotablePersonBody } from './NotablePersonBody';

import {
  AppDependenciesContext,
  AppDependencies,
} from 'appDependenciesContext';
import { warningIcon } from './warningIcon';

import { setAlternativeSearchBoxText } from 'store/features/search/actions';
import { isWhitelistedPage } from 'redirectionMap';

import { LoadableSearchResults } from 'pages/SearchResults/LoadableSearchResults';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import { styles as getLoadableStyles } from './LoadableNotablePerson';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      ...getLoadableStyles(theme).root,
    },
    stub: {
      padding: 20,
    },
    comments: {
      padding: 10,
    },
    editorialSummary: {
      alignSelf: 'center',
      maxWidth: theme.breakpoints.values.sm,
    },
    relatedPeopleTitle: {
      marginTop: 20,
      marginLeft: 20,
    },
  });

type Props = WithStyles<ReturnType<typeof styles>>;

type NotablePersonType = NotablePersonQuery['notablePerson'];
type Result = AsyncResult<NotablePersonQuery | null>;

export const NotablePerson = withRouter(
  withStyles(styles)(
    class extends React.Component<Props & RouteComponentProps<any>> {
      createLoad = ({
        apiClient,
      }: Pick<AppDependencies, 'apiClient'>) => async () => {
        const { slug } = this.props.match.params;

        const result = await apiClient.request<NotablePersonQuery>(query, {
          slug,
        });

        LoadableSearchResults.preload();

        return result;
      };

      renderRelatedPeople = (notablePerson: NonNullable<NotablePersonType>) => {
        const { relatedPeople } = notablePerson;
        const { classes } = this.props;

        return relatedPeople.length ? (
          <Card>
            <Typography
              className={classes.relatedPeopleTitle}
              gutterBottom
              variant="title"
            >
              Other interesting profiles
            </Typography>
            <RelatedPeople people={relatedPeople} />
          </Card>
        ) : null;
      };

      renderFbComments = (notablePerson: NonNullable<NotablePersonType>) => {
        const { commentsUrl } = notablePerson;
        const { classes } = this.props;

        return (
          <IntersectionObserver rootMargin="0% 0% 25% 0%" triggerOnce>
            {inView =>
              inView ? (
                <Card className={cc([classes.comments])}>
                  <FbComments url={commentsUrl} />
                </Card>
              ) : null
            }
          </IntersectionObserver>
        );
      };

      renderEditorialSummary = (
        notablePerson: NonNullable<NotablePersonType>,
      ) => {
        const { editorialSummary, slug, name } = notablePerson;
        const { classes } = this.props;

        return editorialSummary ? (
          <Card className={cc([classes.editorialSummary])}>
            <EditorialSummary id={slug} {...editorialSummary} />
          </Card>
        ) : (
          <div className={classes.stub}>
            Share what you know about the religion and political views of {name}{' '}
            in the comments below
          </div>
        );
      };

      renderErrorStatus = (error?: Error) => (
        <>
          <Status code={500} error={error} />
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

      renderNonErrorStatus = (result: Exclude<Result, ErrorResult>) => {
        if (isSuccessResult(result) && result.value !== null) {
          if (result.value.notablePerson !== null) {
            return this.render200Status(result.value.notablePerson);
          }

          return this.render404Status();
        }

        return <NotablePersonBody />;
      };

      render() {
        const {
          classes,
          match: {
            params: { slug },
          },
        } = this.props;
        const pageUrl = this.props.history.createHref(this.props.location);

        return (
          <AppDependenciesContext.Consumer>
            {dependencies => (
              <WithData
                requestId={slug}
                dataKey="notablePersonQuery"
                forPage={pageUrl}
                load={this.createLoad(dependencies)}
              >
                {({ result }: { result: Result }) => (
                  <div className={classes.root}>
                    {isErrorResult(result)
                      ? this.renderErrorStatus(result.error)
                      : this.renderNonErrorStatus(result)}
                  </div>
                )}
              </WithData>
            )}
          </AppDependenciesContext.Consumer>
        );
      }
    },
  ),
);
