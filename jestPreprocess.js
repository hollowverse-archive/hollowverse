/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-env node */
const babelJest = require('babel-jest');
const { createBabelConfig } = require('./src/webpack/babel');

const babelOptions = createBabelConfig({ isNode: true });

module.exports = babelJest.createTransformer(babelOptions);
