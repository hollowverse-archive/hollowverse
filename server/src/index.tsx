import { StyleSheetServer } from 'aphrodite';
import * as Express from 'express';
import * as path from 'path';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { App } from 'client/src/app/app';
import { store } from './redux.store';

const app = Express();
const port = 3000;

let renderFullPage: RenderFullPage;

type HandleRender = (req: any, res: any) => void;

type RenderFullPage = (
  elements: { html: any; css: any; preloadedState: any },
) => string;

// We are going to fill these out in the sections to follow
let handleRender: HandleRender;
handleRender = (_, res) => {
  const { html, css } = StyleSheetServer.renderStatic(() => {
    return renderToString(
      <Provider store={store}>
        <App />
      </Provider>,
    );
  });

  // Grab the initial state from our Redux store
  const preloadedState = store.getState();
  // Collect the arguments
  const elements = {
    html,
    css,
    preloadedState,
  };
  // Send the rendered page back to the client
  res.send(renderFullPage(elements));
};

renderFullPage = elements => {
  const { html, css, preloadedState } = elements;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <link href="https://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
  <style data-aphrodite>${css.content}</style>
  <title>Hollowverse</title>
</head>

<body>
<div id="app">${html}</div>
<script>
  StyleSheet.rehydrate(${JSON.stringify(css.renderedClassNames)});
  window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
    /</g,
    '\\u003c',
  )}
</script>
<script type="text/javascript" src="https://connect.facebook.net/en_US/sdk.js"></script>
<script type="text/javascript" src="bundle.js"></script>
</body>
</html>
`;
};

// This is fired every time the server side receives a request
app.use(Express.static(path.join(__dirname, '../../client/dist')));
app.use(handleRender);

app.listen(port);
