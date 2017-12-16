import * as React from 'react';
import { StoreState } from 'store/types';

import * as classes from './SearchResults.module.scss';

import FlipMove from 'react-flip-move';
import { Card } from 'components/Card/Card';
import { AsyncResult, makeResult } from 'helpers/asyncResults';
import { resolve } from 'react-resolver';
import { AlgoliaResponse } from 'algoliasearch';
import { connect } from 'react-redux';
import { getSearchQuery } from 'store/features/search/selectors';
import { notablePeople } from 'vendor/algolia';

type ResolvedProps = {
  searchResults: AsyncResult<AlgoliaResponse | null>;
};

type OwnProps = {
  searchQuery: string;
};

class Page extends React.PureComponent<OwnProps & ResolvedProps> {
  render() {
    const { searchResults } = this.props;

    return (
      <div className={classes.root}>
        {searchResults.value && searchResults.value.hits.length > 0 ? (
          <Card className={classes.results}>
            <ol>
              <FlipMove
                enterAnimation="fade"
                leaveAnimation="fade"
                duration={100}
              >
                {searchResults.value.hits.map(result => {
                  return (
                    <li key={result.objectID} className={classes.result}>
                      {result.name}
                    </li>
                  );
                })}
              </FlipMove>
            </ol>
          </Card>
        ) : null}
      </div>
    );
  }
}

const ResolvedPage = resolve<OwnProps, ResolvedProps>({
  searchResults: async ({ searchQuery }) => {
    return makeResult(notablePeople.search(searchQuery));
  },
})(Page as any);

export const SearchResults = connect((state: StoreState) => ({
  searchQuery: getSearchQuery(state),
}))(ResolvedPage);
