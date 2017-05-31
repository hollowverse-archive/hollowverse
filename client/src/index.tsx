import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Route, RouteComponentProps, Switch} from 'react-router-dom'
import {ConnectedRouter} from 'react-router-redux'
import {App} from './app/app'
import {requireUserLogin} from './hocs/requireUserLogin'
import {AddNotablePerson} from './pages/addNotablePerson/addNotablePerson'
import {Homepage} from './pages/homepage/homepage'
import Login from './pages/login/login'
import {NotablePerson} from './pages/notablePerson/notablePerson'
import {history, store} from './redux/store'
// import Search from "./page/search/search"

/* For testing purposes */
class ContactUs extends React.Component<RouteComponentProps<any>, {}> {
  render() {
    return <div>Contact us!</div>
  }
}
/*                     */

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route path='/notable-person/:id' component={NotablePerson}/>
          <Route path='/contact-us' component={ContactUs}/>
          <Route path='/' component={Homepage}/>
        </Switch>
        {/*/!*<Route path='/create-profile' component={CreateProfile}/>*!/*/}
        {/*/!*<Route path="/create-profile" component={requireUserLogin(CreateProfile)}/>*!/*/}
        {/*/!*<Route path="/search" component={Search}/>*!/*/}
        {/*/!*<Route path="/login" component={Login}/>*!/*/}
      </App>
    </ConnectedRouter>
  </Provider>,

  document.getElementById('app'),
)
