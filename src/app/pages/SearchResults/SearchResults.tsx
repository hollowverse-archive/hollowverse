import * as React from 'react';
import { StoreState } from 'store/types';

import * as classes from './SearchResults.module.scss';

import FlipMove from 'react-flip-move';
import { Card } from 'components/Card/Card';
import {
  AsyncResult,
  isPendingResult,
  isSuccessResult,
  isOptimisticResult,
  promiseToAsyncResult,
} from 'helpers/asyncResults';
import { AlgoliaResponse } from 'algoliasearch';
import { connect } from 'react-redux';
import { getSearchQuery } from 'store/features/search/selectors';
import { notablePeople } from 'vendor/algolia';
import { Link } from 'react-router-dom';
import { setSearchResults } from 'store/features/search/actions';
import { ResolvableComponent } from 'hocs/ResolvableComponent/ResolvableComponent';

type Props = {
  searchQuery: string | null;
  searchResults: AsyncResult<AlgoliaResponse | null>;
  setSearchResults(v: AsyncResult<AlgoliaResponse | null>): any;
};

class Page extends React.PureComponent<Props> {
  render() {
    const { searchResults, searchQuery } = this.props;
    if (!searchQuery) {
      return <div>Type something in the search box</div>;
    }

    if (isSuccessResult(searchResults) || isOptimisticResult(searchResults)) {
      const value = searchResults.value;

      return (
        <div className={classes.root}>
          {value && value.hits.length > 0 ? (
            <Card className={classes.results}>
              <ol>
                <FlipMove
                  enterAnimation="fade"
                  leaveAnimation="fade"
                  duration={100}
                >
                  {value.hits.map(searchResult => {
                    return (
                      <li
                        key={searchResult.objectID}
                        className={classes.result}
                      >
                        <Link to={`/${searchResult.slug}`}>
                          {searchResult.name}
                        </Link>
                      </li>
                    );
                  })}
                </FlipMove>
              </ol>
            </Card>
          ) : null}
        </div>
      );
    } else if (isPendingResult(searchResults)) {
      return <div>Loading...</div>;
    }

    return <div>Error</div>;
  }
}

export const SearchResults = connect(
  (state: StoreState) => ({
    searchQuery: getSearchQuery(state),
    searchResults: state.searchResults,
  }),
  { setSearchResults },
)(props => {
  if (__IS_SERVER__) {
    const loadAndDispatch = async (): Promise<AlgoliaResponse | null> => {
      const { searchQuery } = props;
      const value = searchQuery
        ? notablePeople.search(searchQuery)
        : Promise.resolve(null);
      setSearchResults(await promiseToAsyncResult(value));

      return value;
    };

    return (
      <ResolvableComponent load={loadAndDispatch}>
        {({ result }) => <Page {...props} searchResults={result} />}
      </ResolvableComponent>
    );
  }

  return <Page {...props} />;
});
