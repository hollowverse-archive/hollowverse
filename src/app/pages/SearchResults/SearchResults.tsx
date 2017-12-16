import * as React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
// import cc from 'classcat';
import { AppState } from 'store/types';

import * as classes from './SearchResults.module.scss';

import FlipMove from 'react-flip-move';
import { Card } from 'components/Card/Card';

type Props = Pick<AppState, 'searchResults'>;

class Page extends React.PureComponent<Props> {
  render() {
    const { searchResults } = this.props;

    return (
      <div className={classes.root}>
        {searchResults &&
        searchResults.value &&
        searchResults.value.hits.length > 0 ? (
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

const ConnectedPage = connect((state: AppState) => ({
  searchResults: state.searchResults,
}))(Page);

export const SearchResults = withRouter(_ => {
  // const query = new URLSearchParams(location.search).get('query');

  return <ConnectedPage />;
});
