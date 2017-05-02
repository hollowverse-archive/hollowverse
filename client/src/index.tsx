import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Route, BrowserRouter as Router} from 'react-router-dom'
import {store, history} from './redux/store'
import {requireUserLogin} from './hoc/requireUserLogin'
import {ConnectedRouter} from 'react-router-redux'
import {App} from './app/app'
import {Homepage} from './page/homepage/homepage'
import {CreateProfile} from './page/createProfile/createProfile'
import Login from './page/login/login'
// import notablePerson from "./page/notablePerson/notablePerson"
// import Search from "./page/search/search"

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Route exact path='/' component={Homepage}/>
        {/*/!*<Route path='/create-profile' component={CreateProfile}/>*!/*/}
        {/*/!*<Route path="/create-profile" component={requireUserLogin(CreateProfile)}/>*!/*/}
        {/*/!*<Route path="/search" component={Search}/>*!/*/}
        {/*/!*<Route path="/login" component={Login}/>*!/*/}
      </App>
    </ConnectedRouter>
  </Provider>,

  document.getElementById('app'),
)
