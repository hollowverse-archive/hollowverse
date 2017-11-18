const { compact } = require('lodash');

const { pkg } = require('./variables');

const { ifEs5, ifEsNext, ifProd, isProd, ifReact, isDebug } = require('./env');

module.exports.createBabelConfig = (isServer = false) => ({
  presets: compact([
    ...ifEs5(['es2015']),
    ...ifEsNext(
      compact([
        ...ifProd([
          [
            'minify',
            {
              removeConsole: true,
              removeDebugger: true,
              simplifyComparisons: false, // Buggy
              mangle: false, // Buggy
              simplify: false, // Buggy
            },
          ],
          ifReact('react-optimize'),
        ]),
        [
          'env',
          {
            modules: false,
            loose: true,
            debug: isDebug,
            targets: isServer
              ? {
                  node: 'current',
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
      'universal-import',
      {
        disableWarnings: isProd,
      },
    ],
    'syntax-dynamic-import',
    ...ifProd([
      // Compile gql`query { ... }` at build time to avoid runtime parsing overhead
      'graphql-tag',
      'transform-node-env-inline',
      'transform-inline-environment-variables',
    ]),
  ]),
  sourceMaps: 'both',
});
