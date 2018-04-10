#! /usr/bin/env node

/* eslint-disable no-console */
const clientConfig = require('./src/webpack/webpack.config.client');
const serverConfig = require('./src/webpack/webpack.config.server');
const { build } = require('./src/webpack/builder');
const { isProd } = require('./src/webpack/env');
const { promisify } = require('util');
const fs = require('fs');

const writeFile = promisify(fs.writeFile);

if (isProd) {
  build([clientConfig, serverConfig])
    .then(stats => {
      console.info('Build complete.');

      // Build stats are required for SSR middleware at runtime
      return writeFile(
        './dist/stats.json',
        JSON.stringify(stats.toJson(), undefined, 2),
      );
    })
    .catch(err => {
      console.error('Failed to build');
      if (Array.isArray(err) && err[0].errors) {
        err.forEach(webpackCompilerStats => {
          console.error(webpackCompilerStats.toString('errors-only'));
        });
      } else {
        console.error(err);
      }
      process.exit(1);
    });
} else {
  console.warn(
    'This script should only be used to build a production build. ' +
      'Run `yarn dev` for development, or set NODE_ENV to "production"',
  );
  process.exit(1);
}
