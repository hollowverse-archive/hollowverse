const { compact } = require('lodash');

const { pkg } = require('./variables');

const { ifEs5, ifEsNext, ifProd, isProd, ifReact, isDebug } = require('./env');

module.exports.createBabelConfig = (isServer = false) => ({
  presets: compact([
    ...ifEs5(['es2015']),
    ...ifEsNext(
      compact([
        ...ifProd([ifReact('react-optimize')]),
        [
          'env',
          {
            modules: false,
            loose: true,
            debug: isDebug,
            targets: isServer
              ? {
                  node: 'current',
                  browsers: [],
                }
              : {
                  browsers: pkg.browserslist,
                },
            useBuiltIns: true,
          },
        ],
      ]),
    ),
    'react',
    'stage-3',
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
    'syntax-dynamic-import',
    ...ifProd([
      // Compile gql`query { ... }` at build time to avoid runtime parsing overhead
      'graphql-tag',
      'transform-node-env-inline',
      'transform-inline-environment-variables',
      'lodash',
    ]),
  ]),
  sourceMaps: 'both',
});
