import * as React from 'react';
import { NavBar } from 'components/NavBar/NavBar';
import { Route, Switch } from 'react-router-dom';

import './App.global.scss';
import * as classes from './App.module.scss';

import NotablePersonPage from 'pages/NotablePerson/LoadableNotablePerson';

/** Main app component */
export class App extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className={classes.app}>
        <NavBar title="Hollowverse" />
        <div className={classes.appView}>
          <Switch>
            <Route path="/:slug" component={NotablePersonPage} />
          </Switch>
        </div>
      </div>
    );
  }
}
