import * as Express from 'express'
import * as React from 'react'
import {Provider} from 'react-redux'
import {App} from '../../client/src/main.app'
import {renderToString} from 'react-dom/server'
import {store} from './redux.store'
import * as path from 'path'

const app = Express()
const port = 3000

// This is fired every time the server side receives a request
app.use(Express.static(path.join(__dirname, '../../client/dist')))
app.use(handleRender)

// We are going to fill these out in the sections to follow
function handleRender(req: any, res: any) {
  // Create a new Redux store instance
  // Render the component to a string
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )

  // Grab the initial state from our Redux store
  const preloadedState = store.getState()

  // Send the rendered page back to the client
  res.send(renderFullPage(html, preloadedState))
}

function renderFullPage(html: any, preloadedState: any) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="css/styles.css">
  <title>Hollowverse</title>
</head>

<body>
<div id="app">${html}</div>
<script>
  window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
</script>
<script type="text/javascript" src="https://connect.facebook.net/en_US/sdk.js"></script>
<script type="text/javascript" src="bundle.js"></script>
</body>
</html>
`
}

app.listen(port)
