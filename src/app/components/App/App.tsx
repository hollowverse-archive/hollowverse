import * as React from 'react';
import cc from 'classcat';
import { ConnectedNavBar } from 'components/NavBar/ConnectedNavBar';
import { Route, Switch, withRouter } from 'react-router';

import './App.global.scss';
import * as classes from './App.module.scss';

import { LoadableNotablePerson } from 'pages/NotablePerson/LoadableNotablePerson';
import { LoadableSearchResults } from 'pages/SearchResults/LoadableSearchResults';

/**
 * Main app component
 * 
 * Q: Why is this wrapped in `withRouter`?
 * A: See https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
 */
export const App = withRouter(
  class extends React.PureComponent {
    render() {
      return (
        <div className={cc([classes.root, { 'no-js': __IS_SERVER__ }])}>
          <ConnectedNavBar title="Hollowverse" />
          <div className={classes.view}>
            <Switch>
              <Route path="/search" component={LoadableSearchResults} />
              <Route path="/:slug" component={LoadableNotablePerson} />
            </Switch>
          </div>
        </div>
      );
    }
  },
);
