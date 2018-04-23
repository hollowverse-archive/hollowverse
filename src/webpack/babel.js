const { compact } = require('lodash');
const path = require('path');

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.join(process.cwd(), './package.json'));

const {
  ifProd,
  isTest,
  ifTest,
  isDebug,
  createConditionalWithFallback,
} = require('@hollowverse/utils/helpers/env');

const ifNotTest = createConditionalWithFallback(!isTest);

/**
 * @param {object} options
 * @param {boolean} options.isNode
 */
module.exports.createBabelConfig = options => ({
  presets: compact([
    [
      '@babel/preset-env',
      {
        modules: isTest ? 'commonjs' : false,
        loose: false,
        debug: isDebug,
        ignoreBrowserslistConfig: true,
        targets: options.isNode
          ? {
              node: 'current',
            }
          : {
              browsers: pkg.browserslist,
            },
        useBuiltIns: 'usage',
        shippedProposals: false,
      },
    ],
    '@babel/preset-stage-3',
    '@babel/preset-react',
  ]),
  plugins: compact([
    'lodash',
    ...ifNotTest(['react-hot-loader/babel']),
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    ifTest('babel-plugin-dynamic-import-node'),
    ...ifProd([
      [
        'transform-inline-environment-variables',
        {
          // Do not inline the following environment variables
          // so that we can toggle this variable at runtime without
          // having to re-build
          exclude: ['NO_PROXY'],
        },
      ],
    ]),
  ]),
  ...ifNotTest({ sourceMap: 'both' }),
  retainLines: true,
});
