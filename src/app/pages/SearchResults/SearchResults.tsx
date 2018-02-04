import * as React from 'react';
import { StoreState } from 'store/types';

import * as classes from './SearchResults.module.scss';
import Helmet from 'react-helmet-async';

import { Card } from 'components/Card/Card';
import {
  AsyncResult,
  isPendingResult,
  isSuccessResult,
  isOptimisticResult,
} from 'helpers/asyncResults';
import { AlgoliaResponse } from 'algoliasearch';
import { connect } from 'react-redux';
import { getSearchQuery } from 'store/features/search/selectors';
import { WithData } from 'hocs/WithData/WithData';
import { Status } from 'components/Status/Status';
import { SearchResultsSkeleton } from './SearchResultsSkeleton';

import algoliaLogo from '!!file-loader!svgo-loader!assets/algoliaLogo.svg';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';

import searchIcon from '../../icons/search.svg';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { LinkButton } from 'components/Button/Button';
import { forceReload } from 'helpers/forceReload';
import { searchResultSelected } from 'store/features/logging/actions';

import { ResultsList } from './ResultsList';

type Props = {
  searchQuery: string | null;
  searchResultSelected(path: string): any;
};

class Page extends React.PureComponent<Props> {
  load = async (): Promise<null | AlgoliaResponse> => {
    const { searchQuery } = this.props;

    if (searchQuery) {
      return import('vendor/algolia').then(({ notablePeople }) =>
        notablePeople.search(searchQuery),
      );
    }

    return null;
  };

  render() {
    const { searchQuery } = this.props;

    return (
      <div className={classes.root}>
        <Helmet>
          <title>Search</title>
        </Helmet>
        <div className={classes.resultsContainer}>
          <WithData
            requestId={searchQuery}
            dataKey="searchResults"
            load={this.load}
            allowOptimisticUpdates
          >
            {({ result }: { result: AsyncResult<AlgoliaResponse | null> }) => {
              if (isSuccessResult(result) || isOptimisticResult(result)) {
                const value = result.value;

                // User just landed on search page, page is empty
                if (!searchQuery || !value) {
                  return <Status code={200} />;
                }

                if (value.hits.length === 0) {
                  return (
                    <MessageWithIcon
                      className={classes.placeholder}
                      icon={<SvgIcon {...searchIcon} />}
                      title="No results found"
                    >
                      <Status key={searchQuery} code={404} />
                    </MessageWithIcon>
                  );
                }

                return (
                  <div>
                    <Card className={classes.card}>
                      <ResultsList
                        hits={value.hits}
                        onResultClick={this.props.searchResultSelected}
                      />
                      <Status key={searchQuery} code={200} />
                    </Card>
                  </div>
                );
              }

              if (isPendingResult(result)) {
                return <SearchResultsSkeleton />;
              }

              return (
                <MessageWithIcon
                  className={classes.placeholder}
                  icon={<SvgIcon {...searchIcon} />}
                  title="Failed to load search results"
                  button={
                    <LinkButton to={location} onClick={forceReload}>
                      Reload
                    </LinkButton>
                  }
                >
                  <Status code={500} />
                </MessageWithIcon>
              );
            }}
          </WithData>
        </div>
        <small className={classes.algoliaContainer}>
          Search powered by
          <img className={classes.logo} src={algoliaLogo} alt="Algolia" />
        </small>
      </div>
    );
  }
}

export const SearchResults = connect(
  (state: StoreState) => ({
    searchQuery: getSearchQuery(state),
  }),
  { searchResultSelected },
)(Page);
