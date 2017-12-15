import * as React from 'react';
import { withRouter } from 'react-router';
// import cc from 'classcat';

import * as classes from './SearchResults.module.scss';

type Props = {
  query?: string | null;
};

class Page extends React.PureComponent<Props> {
  render() {
    return (
      <div className={classes.root}>Search results for {this.props.query}</div>
    );
  }
}

export const SearchResults = withRouter(({ location }) => {
  const query = new URLSearchParams(location.search).get('query');

  return <Page query={query} />;
});
