import * as React from "react";
import * as ReactDOM from "react-dom";
import {Homepage} from "./page.homepage";
import {App} from './main.app'
// import Search from "./page.search";
import {CreateProfile} from "./page.createProfile";
import Login from "./page.login";
import {Provider, connect} from 'react-redux'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {store} from './redux.store'
import {requireUserLogin} from './hoc.requireUserLogin'
import {syncHistoryWithStore, routerReducer} from 'react-router-redux'

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Homepage}/>
        <Route path="/create-profile" component={CreateProfile}/>
        {/*<Route path="/create-profile" component={requireUserLogin(CreateProfile)}/>*/}
        {/*<Route path="/search" component={Search}/>*/}
        {/*<Route path="/login" component={Login}/>*/}
      </Route>
    </Router>
  </Provider>,
  document.getElementById("app")
);
