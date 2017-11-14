const path = require('path');

exports.publicPath = '/static/';
exports.srcDirectory = path.resolve(__dirname, '..', 'app');
exports.distDirectory = path.resolve(
  process.cwd(),
  process.env.BUILD_PATH || './dist/app',
);

exports.excludedPatterns = [/node_modules/];
exports.cssModulesPattern = /\.module\.s?css$/;

// eslint-disable-next-line import/no-dynamic-require
exports.pkg = require(path.join(process.cwd(), './package.json'));
