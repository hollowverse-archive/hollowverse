import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { App } from './app/app';
// import { requireUserLogin } from './hocs/requireUserLogin';
// import { AddNotablePerson } from './pages/addNotablePerson/addNotablePerson';
import { Homepage } from './pages/homepage/homepage';
// import Login from './pages/login/login';
import { NotablePerson } from './pages/notablePerson/notablePerson';
import { history, store } from './store/store';
// import Search from "./page/search/search"

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          {/*<Route path='/create-profile' component={CreateProfile}/>*/}
          {/*<Route path="/create-profile" component={requireUserLogin(CreateProfile)}/>*/}
          {/*<Route path="/search" component={Search}/>*/}
          {/*<Route path="/login" component={Login}/>*/}
          <Route path="/:slug" component={NotablePerson} />
          <Route path="/" component={Homepage} />
        </Switch>
      </App>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app'),
);
