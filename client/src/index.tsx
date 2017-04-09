import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Homepage} from './page/homepage'
import {App} from './app/app'
// import Search from "./page.search";
import {CreateProfile} from './page/createProfile'
import Login from './page/login'
import {Provider} from 'react-redux'
import {Route, BrowserRouter as Router} from 'react-router-dom'
import {store, history} from './redux/store'
import {requireUserLogin} from './hoc/requireUserLogin'
import {ConnectedRouter} from 'react-router-redux'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        {/*
          TODO: components cast as "any" for this reason:
          https://github.com/hollowverse/hollowverse/issues/35
        */}
        <Route exact path='/' component={Homepage as any}/>
        {/*/!*<Route path='/create-profile' component={CreateProfile}/>*!/*/}
        {/*/!*<Route path="/create-profile" component={requireUserLogin(CreateProfile)}/>*!/*/}
        {/*/!*<Route path="/search" component={Search}/>*!/*/}
        {/*/!*<Route path="/login" component={Login}/>*!/*/}
      </App>
    </ConnectedRouter>
  </Provider>,

  document.getElementById('app'),
)
