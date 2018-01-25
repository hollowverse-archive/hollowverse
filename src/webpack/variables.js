const path = require('path');

exports.publicPath = '/static/';
exports.srcDirectory = path.join(__dirname, '..', 'app');

const distDirectory = path.join(
  process.cwd(),
  process.env.BUILD_PATH || './dist',
);

exports.clientDistDirectory = path.join(distDirectory, 'client');
exports.serverDistDirectory = path.join(distDirectory, 'server');

exports.excludedPatterns = [/node_modules/];
exports.cssModulesPattern = /\.module\.s?css$/;

// eslint-disable-next-line import/no-dynamic-require
exports.pkg = require(path.join(process.cwd(), './package.json'));
