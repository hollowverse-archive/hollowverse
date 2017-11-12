const express = require('express');
const noFavicon = require('express-no-favicons');

const clientConfig = require('../client/webpack/webpack.config.client');
const serverConfig = require('../client/webpack/webpack.config.server');
const build = require('../client/webpack/builder');

const { publicPath, path: outputPath } = clientConfig.output;

const { PORT = 3005 } = process.env;

build([clientConfig, serverConfig])
  .then(stats => {
    console.info(stats.stats.toString());

    const app = express();

    app.use(noFavicon());

    // Serve client build like usual
    // This must be defined before the SSR middleware so that
    // requests to static files, e.g. /static/app.js, are not
    // routed to React Router
    app.use(publicPath, express.static(outputPath));

    // Serve React Router middleware from the SSR build
    const serverRender = require('../client/dist/main.js').default; // eslint-disable-line global-require
    const clientStats = stats.toJson().children[0];
    app.use(serverRender({ clientStats }));

    app.listen(PORT, () => {
      console.info(`App server is listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
