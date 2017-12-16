import * as React from 'react';
import { withRouter } from 'react-router';
import { connect, Dispatch } from 'react-redux';
// import cc from 'classcat';
import { StoreState } from 'store/types';

import * as classes from './SearchResults.module.scss';

import FlipMove from 'react-flip-move';
import { Card } from 'components/Card/Card';

type Props = {
  results: StoreState['searchResults'];
  dispatch: Dispatch<StoreState>;
};

class Page extends React.PureComponent<Props> {
  render() {
    const { results } = this.props;

    return (
      <div className={classes.root}>
        {/* Search results for {this.props.query} */}
        {results && results.value && results.value.hits.length > 0 ? (
          <Card className={classes.results}>
            <ol>
              <FlipMove
                enterAnimation="fade"
                leaveAnimation="fade"
                duration={100}
              >
                {results.value.hits.map(result => {
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

const ConnectedPage = connect((state: StoreState) => ({
  results: state.searchResults,
}))(Page);

export const SearchResults = withRouter(_ => {
  // const query = new URLSearchParams(location.search).get('query');

  return <ConnectedPage />;
});
