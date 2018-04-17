const { compact } = require('lodash');
const path = require('path');

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.join(process.cwd(), './package.json'));

const {
  ifProd,
  isProd,
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
        useBuiltIns: isTest ? 'usage' : 'entry',
        shippedProposals: false,
      },
    ],
    '@babel/preset-stage-3',
    '@babel/preset-react',
  ]),
  plugins: compact([
    ...ifNotTest([
      [
        // This plugin finds imports of `react-universal-component` and rewrites
        // dynamic imports of components to two import calls: one for JS and one for CSS.
        // Fetching of CSS and JS will occur in parallel on the client.
        // It also allows Webpack to determine the chunk name for the imported component
        // by adding the chunkname as a "magic Webpack comment".
        // In addition, this plugin will record all import calls that it finds when
        // parsing the source files. `webpack-flush-chunks` consumes this data
        // to know which components were part of the server render, and will include
        // the corresponding chunks as external, synchronous JS scripts in the SSR HTML markup.
        // For more details, see
        // https://medium.com/discovery-engineering/b98922382cc1
        'universal-import',
        {
          // Some dynamic imports do not have CSS files associated with them,
          // by default, the plugin will print a warning to the browser console
          // when it finds a JS import with no matching CSS.
          disableWarnings: isProd,
        },
      ],
    ]),
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
          exclude: ['NO_SSR', 'NO_PROXY'],
        },
      ],
      'lodash',
    ]),
  ]),
  ...ifNotTest({ sourceMap: 'both' }),
  retainLines: true,
});
