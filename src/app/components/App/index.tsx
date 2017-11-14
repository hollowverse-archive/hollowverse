import * as React from 'react';
import NavBar from 'components/NavBar';
import { Route, Switch } from 'react-router-dom';

import './styles.global.scss';
import './styles.scss';

import NotablePersonPage from 'pages/notablePerson/notablePerson';

/** Main app component */
export class App extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className="app">
        <NavBar title="Hollowverse" />
        <div className="app-view">
          <Switch>
            <Route path="/:slug" component={NotablePersonPage} />
          </Switch>
        </div>
      </div>
    );
  }
}
