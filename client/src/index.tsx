import {ConnectedRouter} from 'connected-react-router'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import {App} from './app/app'
import {history, store} from './redux/store'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>,

  document.getElementById('app'),
)
