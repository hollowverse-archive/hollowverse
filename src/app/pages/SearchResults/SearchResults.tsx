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
import { Status } from 'components/Status/Status';

import algoliaLogo from '!!file-loader!svgo-loader!assets/algolia/algolia-logo-light.svg';

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
        <div className={classes.resultsContainer}>
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

                if (
                  __IS_SERVER__ &&
                  value &&
                  value.hits &&
                  value.hits.length === 1
                ) {
                  return (
                    <Status code={301} redirectTo={`${value.hits[0].slug}`} />
                  );
                }

                return (
                  <div>
                    {value && value.hits.length > 0 ? (
                      <Card className={classes.card}>
                        <FlipMove
                          typeName="ol"
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
        <small className={classes.algoliaContainer}>
          Search powered by
          <img className={classes.logo} src={algoliaLogo} alt="Algolia" />
        </small>
      </div>
    );
  }
}

export const SearchResults = connect((state: StoreState) => ({
  searchQuery: getSearchQuery(state),
}))(Page);
