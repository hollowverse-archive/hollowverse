import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Route, BrowserRouter as Router} from 'react-router-dom'
import {store, history} from './redux/store'
import {ConnectedRouter} from 'react-router-redux'
import {requireUserLogin} from './hocs/requireUserLogin'
import {App} from './app/app'
import {Homepage} from './pages/homepage/homepage'
import {AddNotablePerson} from './pages/addNotablePerson/addNotablePerson'
import {NotablePerson} from './pages/notablePerson/notablePerson'
import Login from './pages/login/login'
// import Search from "./page/search/search"

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Route exact path='/' component={Homepage}/>
        <Route exact path='/notable-person' component={NotablePerson}/>
        {/*/!*<Route path='/create-profile' component={CreateProfile}/>*!/*/}
        {/*/!*<Route path="/create-profile" component={requireUserLogin(CreateProfile)}/>*!/*/}
        {/*/!*<Route path="/search" component={Search}/>*!/*/}
        {/*/!*<Route path="/login" component={Login}/>*!/*/}
      </App>
    </ConnectedRouter>
  </Provider>,

  document.getElementById('app'),
)
