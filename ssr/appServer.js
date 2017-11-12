const express = require('express');
const webpack = require('webpack');
const noFavicon = require('express-no-favicons');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');
// const webpackHotServerMiddleware = require('webpack-hot-server-middleware');

// tslint:disable no-require-imports no-var-requires
const clientConfig = require('../client/webpack.config.client');
const serverConfig = require('../client/webpack.config.server');

const publicPath = clientConfig.output.publicPath;
const outputPath = clientConfig.output.path;
// const DEV = process.env.NODE_ENV === 'development';

const app = express();

app.use(noFavicon());

let isBuilt = false;

const done = () =>
  !isBuilt &&
  app.listen(3005, () => {
    isBuilt = true;
    console.log('BUILD COMPLETE -- Listening @ http://localhost:3005');
  });

// if (DEV) {
//   const compiler = webpack([clientConfig, serverConfig]);

//   // @ts-ignore
//   const clientCompiler = compiler.compilers[0];
//   const options = { publicPath, stats: { colors: true } };

//   app.use(webpackDevMiddleware(compiler, options));
//   app.use(webpackHotMiddleware(clientCompiler));
//   app.use(webpackHotServerMiddleware(compiler));

//   compiler.plugin('done', done);
// }
// else {
webpack([clientConfig, serverConfig]).run((err, stats) => {
  if (err) {
    console.error(err);
    throw err;
  }
  const clientStats = stats.toJson().children[0];
  const serverRender = require('../client/dist/main.js').default;

  app.use(publicPath, express.static(outputPath));
  app.use(serverRender({ clientStats }));

  done();
});
// }

process.on('unhandledRejection', err => {
  console.error(err);
});
