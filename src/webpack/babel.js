const { compact } = require('lodash');

const { pkg } = require('./variables');

const { ifEs5, ifEsNext, ifProd, isProd, isDebug } = require('./env');

module.exports.createBabelConfig = (isNode = false) => ({
  presets: compact([
    ...ifEs5(['@babel/preset-es2015']),
    ...ifEsNext(
      compact([
        [
          '@babel/preset-env',
          {
            modules: false,
            loose: true,
            debug: isDebug,
            ignoreBrowserslistConfig: true,
            targets: isNode
              ? {
                  node: 'current',
                }
              : {
                  browsers: pkg.browserslist,
                },
            useBuiltIns: 'entry',
            shippedProposals: true,
          },
        ],
      ]),
    ),
    '@babel/preset-stage-3',
    '@babel/preset-react',
  ]),
  plugins: compact([
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
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    ...ifProd([
      // Compile gql`query { ... }` at build time to avoid runtime parsing overhead
      'graphql-tag',
      'transform-node-env-inline',
      [
        'transform-inline-environment-variables',
        {
          // Do not inline `NO_SSR` so that we can toggle this variable
          // at runtime without having to re-build
          exclude: ['NO_SSR'],
        },
      ],
      'lodash',
    ]),
  ]),
  sourceMap: 'both',
  retainLines: true,
});
