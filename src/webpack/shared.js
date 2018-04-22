const nodeExternals = require('webpack-node-externals');
const normalize = require('postcss-normalize');
const autoprefixer = require('autoprefixer');
const cssVariables = require('postcss-css-variables');
const postCssSassParser = require('postcss-scss');

const { createBabelConfig } = require('./babel');

const { excludedPatterns, srcDirectory } = require('./variables');

const {
  isProd,
  shouldTypeCheck,
  ifProd,
} = require('@hollowverse/utils/helpers/env');

const postCssPlugins = [
  autoprefixer,

  // Inlines the value of custom CSS properties
  // for browsers that do not support them
  cssVariables({
    /**
     * `preserve` keeps both the custom property declarations and usages
     * as well as the resolved values as a fallback, so that we can change
     * the values dynamically via JavaScript in browsers that do
     * support custom properties.
     */
    preserve: true,
  }),
];

/**
 */
exports.createCssModulesLoaders = () => [
  {
    loader: 'css-loader',

    query: {
      minimize: isProd,
      sourceMap: true,
      modules: true,
      camelCase: 'only',

      localIdentName:
        // Shorten the class name in production bundles to save some bytes
        ifProd('[hash:base64:5]') || '[name]__[local]--[hash:base64:5]',
    },
  },
  {
    loader: 'resolve-url-loader',
    options: {
      sourceMap: true,
    },
  },
  {
    loader: 'sass-loader',
    options: {
      includePaths: [srcDirectory],
      sourceMap: true,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      parser: postCssSassParser,
      plugins: [normalize({ forceImport: false }), ...postCssPlugins],
    },
  },
];

/**
 * @param {object} options
 * @param {boolean} options.isNode
 */
exports.createScriptRules = (options = { isNode: false }) => {
  const babelLoader = {
    loader: 'babel-loader',
    options: createBabelConfig({ isNode: options.isNode }),
  };

  return [
    // Babel
    {
      test: /\.jsx?$/,
      exclude: excludedPatterns,
      use: babelLoader,
    },

    // TypeScript
    {
      test: /\.tsx?$/,
      exclude: excludedPatterns,
      use: [
        babelLoader,
        {
          loader: 'ts-loader',
          options: {
            silent: true,
            transpileOnly: !shouldTypeCheck,
            compilerOptions: {
              noEmitOnError: shouldTypeCheck,
            },
          },
        },
      ],
    },
  ];
};

/**
 * By default, webpack will consume and bundle all `require` calls.
 * `externals` specifies which packages should *not* be bundled by webpack.
 * The following packages are already installed on the server, so they do
 * not need to be bundled. This also reduces the build time for the server bundle.
 * The `webpack-node-externals` package will exclude all packages in `node_modules`
 * so they are not bundled.
 * @param {Record<string, string>} aliases
 */
exports.createExternals = aliases =>
  nodeExternals({
    // `whitelist` excludes node modules so they _are_ bundled with webpack
    whitelist: [
      '.bin',
      'babel-polyfill',

      /**
       * @param {string} moduleName
       */
      moduleName =>
        [
          // These packages need to be bundled so that they
          // know they are running in the context of webpack runtime
          'babel-plugin-universal-import',
          'webpack-flush-chunks',
          'react-universal-component',

          // All aliased packages should be bundled.
          // Example: when using preact instead of React, require('react') should be bundled.
          // Otherwise, the call to require('react') will resolve to the actual
          // `react` package
          ...Object.keys(aliases),
        ].some(match => moduleName.includes(match)),
    ],
  });
