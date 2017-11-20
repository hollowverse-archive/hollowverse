import * as React from 'react';
import { NavBar } from 'components/NavBar/NavBar';
import { Route, Switch } from 'react-router-dom';

import './App.global.scss';
import classes from './App.module.scss';

import NotablePersonPage from 'pages/NotablePerson/LoadableNotablePerson';
import TestPage from 'pages/TestPage/Loadable';

/** Main app component */
export class App extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className={classes.app}>
        <NavBar title="Hollowverse" />
        <div className={classes['app-view']}>
          <Switch>
            <Route path="/Najwa_Karam" component={TestPage} />
            <Route path="/:slug" component={NotablePersonPage} />
          </Switch>
        </div>
      </div>
    );
  }
}
