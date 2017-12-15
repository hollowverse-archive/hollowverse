import * as React from 'react';
import cc from 'classcat';
import { NavBar } from 'components/NavBar/NavBar';
import { Route, Switch } from 'react-router';

import './App.global.scss';
import * as classes from './App.module.scss';

import { LoadableNotablePerson } from 'pages/NotablePerson/LoadableNotablePerson';
import { LoadableSearchResults } from 'pages/SearchResults/LoadableSearchResults';

/** Main app component */
export class App extends React.PureComponent {
  render() {
    return (
      <div className={cc([classes.root, { 'no-js': __IS_SERVER__ }])}>
        <NavBar title="Hollowverse" />
        <div className={classes.view}>
          <Switch>
            <Route path="/search" component={LoadableSearchResults} />
            <Route path="/:slug" component={LoadableNotablePerson} />
          </Switch>
        </div>
      </div>
    );
  }
}
