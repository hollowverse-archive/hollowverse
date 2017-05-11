import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {ConnectedRouter} from 'react-router-redux'
import {App} from './app/app'
import {requireUserLogin} from './hocs/requireUserLogin'
import {AddNotablePerson} from './pages/addNotablePerson/addNotablePerson'
import {Homepage} from './pages/homepage/homepage'
import Login from './pages/login/login'
import {NotablePerson} from './pages/notablePerson/notablePerson'
import {history, store} from './redux/store'
import ContactUs from './pages/contactUs/contactUs'
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
        {<Route path='/contactUs' component={ContactUs}/>}
      </App>
    </ConnectedRouter>
  </Provider>,

  document.getElementById('app'),
)
