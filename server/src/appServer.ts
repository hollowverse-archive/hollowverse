import * as express from 'express';
import * as noFavicon from 'express-no-favicons';
import * as path from 'path';
import * as loglevel from 'loglevel';

import * as clientConfig from '../../client/webpack/webpack.config.client';
import * as serverConfig from '../../client/webpack/webpack.config.server';
import { build } from '../../client/webpack/builder';

const logger = loglevel.getLogger('Web App Server');

const { publicPath, path: outputPath } = clientConfig.output;

const { PORT = 3005 } = process.env;

logger.setLevel(logger.levels.INFO);

build([clientConfig, serverConfig])
  .then(stats => {
    logger.debug(stats.toString());

    const app = express();

    app.use(noFavicon());

    // Serve client build like usual
    // This must be defined before the SSR middleware so that
    // requests to static files, e.g. /static/app.js, are not
    // processed by the server rendering middleware below
    app.use(publicPath, express.static(outputPath));

    // Serve server rendering middleware from the SSR build
    // tslint:disable-next-line no-require-imports non-literal-require
    const { createServerRenderMiddleware } = require(path.resolve(
      process.cwd(),
      'client/dist/main.js',
    ));

    const clientStats = stats.toJson().children[0];
    app.use(createServerRenderMiddleware({ clientStats }));

    app.listen(PORT, () => {
      logger.info(`App server is listening on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('Failed to build', err);
    process.exit(1);
  });
