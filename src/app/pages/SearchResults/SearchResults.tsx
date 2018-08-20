import React from 'react';
import { StoreState } from 'store/types';

import Helmet from 'react-helmet-async';
import { oneLine } from 'common-tags';

import Paper from '@material-ui/core/Paper';
import {
  AsyncResult,
  isSuccessResult,
  isErrorResult,
  ErrorResult,
  isStaleResult,
  isPendingResult,
} from 'helpers/asyncResults';
import { AlgoliaResponse } from 'algoliasearch';
import { connect } from 'react-redux';
import { getSearchQuery } from 'store/features/search/selectors';
import { WithData } from 'hocs/WithData/WithData';
import { Status } from 'components/Status/Status';

import algoliaLogo from 'assets/algoliaLogo.svg';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';

import searchIcon from 'icons/search.svg';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { LinkButton } from 'components/Button/Button';
import { forceReload } from 'helpers/forceReload';
import { searchResultSelected } from 'store/features/logging/actions';

import { ResultsList } from './ResultsList';
import { withRouter, RouteComponentProps } from 'react-router';
import {
  AppDependenciesContext,
  AppDependencies,
} from 'appDependenciesContext';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';

const styles = ({ breakpoints, spacing, palette }: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      width: '100%',
      maxWidth: breakpoints.values.sm,
      flexGrow: 1,
      alignSelf: 'center',
    },
    resultsContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexGrow: 1,
      '& > *': {
        width: '100%',
      },
    },
    card: {
      borderRight: 'none',
      borderLeft: 'none',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      '&:first-child': {
        borderTopColor: 'transparent',
      },
    },
    algoliaContainer: {
      display: 'flex',
      color: palette.text.secondary,
      margin: spacing.unit,
      alignItems: 'center',
      alignSelf: 'flex-end',
      '--color-text': palette.getContrastText(palette.background.default),
      '--color-background': palette.background.default,
    },
    logo: {
      height: '1.8em',
      marginLeft: spacing.unit,
      filter: 'grayscale(100%)',
      opacity: 0.3,
    },
  });

type Props = {
  searchQuery: string | null;
  searchResultSelected(path: string): any;
} & WithStyles<ReturnType<typeof styles>>;

type Result = AsyncResult<AlgoliaResponse | null>;

const Page = withRouter(
  withStyles(styles)(
    class extends React.PureComponent<Props & RouteComponentProps<any>> {
      createLoad = ({
        loadAlgoliaModule,
      }: Pick<
        AppDependencies,
        'loadAlgoliaModule'
      >) => async (): Promise<AlgoliaResponse | null> => {
        const { searchQuery } = this.props;

        if (searchQuery) {
          return loadAlgoliaModule().then(async ({ notablePeople }) =>
            notablePeople.search(searchQuery),
          );
        }

        return null;
      };

      renderAlgoliaLogo = () => {
        const { classes } = this.props;

        return (
          <small className={classes.algoliaContainer}>
            Search powered by
            <SvgIcon size={20} className={classes.logo} {...algoliaLogo} />
          </small>
        );
      };

      renderErrorStatus = (error?: Error) => (
        <>
          <Status code={500} error={error} />
          <Helmet>
            <title>Error loading search page</title>
          </Helmet>
          <MessageWithIcon
            icon={<SvgIcon {...searchIcon} />}
            title="Failed to load search results"
            button={
              <LinkButton to={this.props.location} onClick={forceReload}>
                Reload
              </LinkButton>
            }
          />
        </>
      );

      render404Status = () => (
        <>
          <Status code={404} />
          <Helmet>
            <title>
              No search results were found for {this.props.searchQuery}
            </title>
          </Helmet>
          <MessageWithIcon
            icon={<SvgIcon {...searchIcon} />}
            title="No results found"
          />
        </>
      );

      render200Status = (value?: AlgoliaResponse | null) => {
        const { searchQuery } = this.props;
        const userHasPerformedSearch = !!searchQuery && !!value;

        return (
          <>
            <Status code={200} />
            <Helmet>
              {userHasPerformedSearch
                ? [
                    <title key="title">Search results for {searchQuery}</title>,
                    <meta
                      key="description"
                      name="description"
                      content={oneLine`
                      The philosophy, politics, and ideas of influential people who
                      match ${searchQuery}
                  `}
                    />,
                  ]
                : [
                    <title key="title">Search for influential people</title>,
                    <meta
                      key="description"
                      name="description"
                      content={oneLine`
                      Search for an influential person to find out
                      about their philosophy, politics, and ideas
                    `}
                    />,
                  ]}
            </Helmet>
            {userHasPerformedSearch ? (
              <ResultsList
                // why can't TS tell that `value` here is guaranteed to be `AlgoliaResponse`? 🤔
                {...{ hits: (value as AlgoliaResponse).hits } as any}
                onResultClick={this.props.searchResultSelected}
                aria-live="polite"
              />
            ) : null}
          </>
        );
      };

      renderNonErrorStatus = (result: Exclude<Result, ErrorResult>) => {
        if (isSuccessResult(result) || isStaleResult(result)) {
          const { value } = result;

          if (value && value.hits.length === 0) {
            return this.render404Status();
          }

          return this.render200Status(value);
        }

        return <ResultsList {...{ isLoading: true } as any} />;
      };

      render() {
        const { searchQuery, classes } = this.props;

        return (
          <AppDependenciesContext.Consumer>
            {dependencies => (
              <WithData
                requestId={searchQuery}
                dataKey="searchResults"
                load={this.createLoad(dependencies)}
                keepStaleData
              >
                {({ result }: { result: Result }) => (
                  <div
                    aria-busy={isPendingResult(result)}
                    className={classes.root}
                  >
                    <div className={classes.resultsContainer}>
                      <Paper square={false} className={classes.card}>
                        {isErrorResult(result)
                          ? this.renderErrorStatus(result.error)
                          : this.renderNonErrorStatus(result)}
                      </Paper>
                    </div>
                    {this.renderAlgoliaLogo()}
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

export const SearchResults = connect(
  (state: StoreState) => ({ searchQuery: getSearchQuery(state) }),
  { searchResultSelected },
)(Page);
