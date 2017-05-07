import * as Express from 'express'
import * as React from 'react'
import {Provider} from 'react-redux'
import {renderToString} from 'react-dom/server'
import {store} from './redux.store'
import * as path from 'path'
import {StyleSheetServer} from 'aphrodite'
import {App} from '../../client/src/app/app'

const app = Express()
const port = 3000

interface HandleRender {
  (req: any, res: any): void
}

interface RenderFullPage {
  (elements: {html: any, css: any, preloadedState: any}): string
}

// We are going to fill these out in the sections to follow
let handleRender: HandleRender
handleRender = (req, res) => {
  const {html, css} = StyleSheetServer.renderStatic(() => {
    return renderToString(
      <Provider store={store}>
       <App />
      </Provider>,
    )
  })

  // Grab the initial state from our Redux store
  const preloadedState = store.getState()
  // Send the rendered page back to the client
  let elements = {
    html: html,
    css: css,
    preloadedState: preloadedState,
  }
  res.send(renderFullPage(elements))
}

let renderFullPage: RenderFullPage
renderFullPage = (elements) => {
  const {html, css, preloadedState} = elements
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="css/styles.css">
  <style data-aphrodite>${css.content}</style>
  <title>Hollowverse</title>
</head>

<body>
<div id="app">${html}</div>
<script>
  StyleSheet.rehydrate(${JSON.stringify(css.renderedClassNames)});
  window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
</script>
<script type="text/javascript" src="https://connect.facebook.net/en_US/sdk.js"></script>
<script type="text/javascript" src="bundle.js"></script>
</body>
</html>
`
}

// This is fired every time the server side receives a request
app.use(Express.static(path.join(__dirname, '../../client/dist')))
app.use(handleRender)

app.listen(port)
