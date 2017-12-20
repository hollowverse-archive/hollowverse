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
} from 'helpers/asyncResults';
import { AlgoliaResponse } from 'algoliasearch';
import { connect } from 'react-redux';
import { getSearchQuery } from 'store/features/search/selectors';
import { Link } from 'react-router-dom';
import { ResolvableComponent } from 'hocs/ResolvableComponent/ResolvableComponent';

type Props = {
  searchQuery: string | null;
};

class Page extends React.PureComponent<Props> {
  load = async () => {
    const { searchQuery } = this.props;
    let results: Promise<null | AlgoliaResponse> = Promise.resolve(null);

    if (searchQuery) {
      results = import('vendor/algolia').then(({ notablePeople }) =>
        notablePeople.search(searchQuery),
      );
    }

    return results;
  };

  render() {
    const { searchQuery } = this.props;
    if (!searchQuery) {
      return <div>Type something in the search box</div>;
    }

    return (
      <ResolvableComponent
        updateKey={searchQuery}
        dataKey="searchResults"
        resolve={this.load}
        allowOptimisticUpdates
      >
        {({
          result: searchResults,
        }: {
          result: AsyncResult<AlgoliaResponse | null>;
        }) => {
          if (
            isSuccessResult(searchResults) ||
            isOptimisticResult(searchResults)
          ) {
            const value = searchResults.value;

            return (
              <div className={classes.root}>
                {value && value.hits.length > 0 ? (
                  <Card>
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
                              <Link
                                className={classes.link}
                                to={`/${searchResult.slug}`}
                              >
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
        }}
      </ResolvableComponent>
    );
  }
}

export const SearchResults = connect((state: StoreState) => ({
  searchQuery: getSearchQuery(state),
}))(Page);
