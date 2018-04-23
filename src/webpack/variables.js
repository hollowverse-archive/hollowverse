const path = require('path');

exports.publicPath = '/static/';
exports.srcDirectory = path.join(__dirname, '..', 'app');

const distDirectory = path.join(
  process.cwd(),
  process.env.BUILD_PATH || './dist',
);

exports.clientDistDirectory = path.join(distDirectory, 'client');

exports.excludedPatterns = [/node_modules/];
