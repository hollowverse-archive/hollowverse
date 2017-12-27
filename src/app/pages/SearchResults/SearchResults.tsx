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
import { WithData } from 'hocs/WithData/WithData';
import { Square } from 'components/Square/Square';

type Props = {
  searchQuery: string | null;
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
        <WithData
          requestId={searchQuery}
          dataKey="searchResults"
          load={this.load}
          allowOptimisticUpdates
        >
          {({ result }: { result: AsyncResult<AlgoliaResponse | null> }) => {
            if (isSuccessResult(result) || isOptimisticResult(result)) {
              if (!searchQuery) {
                return null;
              }

              const value = result.value;

              return (
                <div>
                  {value && value.hits.length > 0 ? (
                    <Card>
                      <ol>
                        <FlipMove
                          enterAnimation="fade"
                          leaveAnimation="fade"
                          duration={100}
                        >
                          {value.hits.map(searchResult => {
                            const photo = searchResult.mainPhoto;

                            return (
                              <li
                                key={searchResult.objectID}
                                className={classes.result}
                              >
                                <Link
                                  className={classes.link}
                                  to={`/${searchResult.slug}`}
                                >
                                  <div className={classes.photo}>
                                    <Square>
                                      <img
                                        src={photo ? photo.url : null}
                                        role="presentation"
                                        alt={undefined}
                                      />
                                    </Square>
                                  </div>
                                  <div className={classes.text}>
                                    {searchResult.name}
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </FlipMove>
                      </ol>
                    </Card>
                  ) : (
                    <div>No results found</div>
                  )}
                </div>
              );
            } else if (isPendingResult(result)) {
              return <div>Loading...</div>;
            }

            return <div>Error</div>;
          }}
        </WithData>
      </div>
    );
  }
}

export const SearchResults = connect((state: StoreState) => ({
  searchQuery: getSearchQuery(state),
}))(Page);
