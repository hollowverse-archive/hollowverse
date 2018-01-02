const path = require('path');

exports.publicPath = '/static/';
exports.srcDirectory = path.resolve(__dirname, '..', 'app');

const distDirectory = path.resolve(
  process.cwd(),
  process.env.BUILD_PATH || './dist',
);

exports.clientDistDirectory = path.resolve(distDirectory, 'client');
exports.serverDistDirectory = path.resolve(distDirectory, 'server');

exports.excludedPatterns = [/node_modules/];
exports.cssModulesPattern = /\.module\.s?css$/;

// eslint-disable-next-line import/no-dynamic-require
exports.pkg = require(path.resolve(process.cwd(), './package.json'));
