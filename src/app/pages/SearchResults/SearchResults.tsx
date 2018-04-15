import React from 'react';
import { StoreState } from 'store/types';

import classes from './SearchResults.module.scss';
import Helmet from 'react-helmet-async';
import { oneLine } from 'common-tags';

import { Card } from 'components/Card/Card';
import {
  AsyncResult,
  isSuccessResult,
  isOptimisticResult,
  isErrorResult,
} from 'helpers/asyncResults';
import { AlgoliaResponse } from 'algoliasearch';
import { connect } from 'react-redux';
import { getSearchQuery } from 'store/features/search/selectors';
import { WithData } from 'hocs/WithData/WithData';
import { Status } from 'components/Status/Status';

import algoliaLogo from '!!file-loader!svgo-loader!assets/algoliaLogo.svg';
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

type Props = {
  searchQuery: string | null;
  searchResultSelected(path: string): any;
};
type Result = AsyncResult<AlgoliaResponse | null>;

const Page = withRouter(
  class extends React.PureComponent<Props & RouteComponentProps<any>> {
    createLoad = ({
      loadAlgoliaModule,
    }: Pick<
      AppDependencies,
      'loadAlgoliaModule'
    >) => async (): Promise<null | AlgoliaResponse> => {
      const { searchQuery } = this.props;

      if (searchQuery) {
        return loadAlgoliaModule().then(async ({ notablePeople }) =>
          notablePeople.search(searchQuery),
        );
      }

      return null;
    };

    renderAlgoliaLogo = () => (
      <small className={classes.algoliaContainer}>
        Search powered by
        <img className={classes.logo} src={algoliaLogo} alt="Algolia" />
      </small>
    );

    renderErrorStatus = () => (
      <>
        <Status code={500} />
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
              hits={(value as AlgoliaResponse).hits}
              onResultClick={this.props.searchResultSelected}
            />
          ) : null}
        </>
      );
    };

    renderNonErrorStatus = (result: Result) => {
      const value = result.value;

      if (isSuccessResult(result) || isOptimisticResult(result)) {
        if (value && value.hits.length === 0) {
          return this.render404Status();
        }

        return this.render200Status(value);
      }

      return <ResultsList isLoading />;
    };

    render() {
      const { searchQuery } = this.props;

      return (
        <AppDependenciesContext.Consumer>
          {dependencies => (
            <WithData
              requestId={searchQuery}
              dataKey="searchResults"
              load={this.createLoad(dependencies)}
              allowOptimisticUpdates
            >
              {({ result }: { result: Result }) => (
                <div className={classes.root}>
                  <div className={classes.resultsContainer}>
                    <Card className={classes.card}>
                      {isErrorResult(result)
                        ? this.renderErrorStatus()
                        : this.renderNonErrorStatus(result)}
                    </Card>
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
);

export const SearchResults = connect(
  (state: StoreState) => ({ searchQuery: getSearchQuery(state) }),
  { searchResultSelected },
)(Page);
