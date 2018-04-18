const path = require('path');

exports.publicPath = '/static/';
exports.srcDirectory = path.join(__dirname, '..', 'app');

const distDirectory = path.join(
  process.cwd(),
  process.env.BUILD_PATH || './dist',
);

exports.clientDistDirectory = path.join(distDirectory, 'client');
exports.serverDistDirectory = path.join(distDirectory, 'server');
exports.testsDistDirectory = path.join(process.cwd(), '__tests__');

exports.excludedPatterns = [/node_modules/];
exports.cssModulesPattern = /\.module\.s?css$/;
