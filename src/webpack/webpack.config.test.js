const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const { compact } = require('lodash');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WildcardsEntryWebpackPlugin = require('wildcards-entry-webpack-plugin');

const { createScriptRules, createGlobalCssLoaders } = require('./shared');
const {
  srcDirectory,
  testsDistDirectory,
  publicPath,
  excludedPatterns,
  cssModulesPattern,
} = require('./variables');
const { createCommonConfig } = require('./webpack.config.common');

const common = createCommonConfig();

const testSpecificConfig = {
  name: 'tests',
  target: 'web',

  // This plugin watches added/removed test files and
  // updates webpack entries so that we do not have
  // to restart webpack again in watch mode to pick
  // up the changes.
  entry: WildcardsEntryWebpackPlugin.entry(
    path.resolve(srcDirectory, '__tests__/**/*.{ts,tsx}'),
    undefined,
    '/../tests',
  ),

  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.join(testsDistDirectory, 'bundle'),
    publicPath,

    // By default, webpack will generate source map URLs starting
    // with webpack://, but we need the actual, absolute file path
    // for Jest to find the source files.
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },

  stats: 'errors-only',

  performance: false,

  // By default, webpack will consume and bundle all `require` calls.
  // `externals` specifies which packages should *not* be bundled by webpack.
  // The following packages are already installed on the server, so they do
  // not need to be bundled. This also reduces the build time for the server bundle.
  // The `webpack-node-externals` package will exclude all packages in `node_modules`
  // so they are not bundled.
  externals: nodeExternals({
    // `whitelist` excludes node modules so they _are_ bundled with webpack
    whitelist: [
      '.bin',
      'babel-polyfill',

      // @ts-ignore
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
          ...Object.keys(common.resolve.alias),
        ].some(match => moduleName.includes(match)),
    ],
  }),

  module: {
    rules: compact([
      // CSS Modules
      {
        test: cssModulesPattern,
        exclude: excludedPatterns,
        use: createGlobalCssLoaders(true),
      },

      // JavaScript and TypeScript
      ...createScriptRules(false),

      // Global CSS
      {
        test: /\.s?css$/,
        exclude: [...excludedPatterns, cssModulesPattern],
        use: createGlobalCssLoaders(true),
      },
    ]),
  },

  plugins: compact([
    new WildcardsEntryWebpackPlugin(),

    // Required for debugging in development and for long-term caching in production
    new webpack.NamedModulesPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.context),
    }),

    // Contains all Webpack bootstraping logic, required for `react-universal-component`
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'],
      filename: '[name].js',
      minChunks: Infinity,
    }),

    // Environment
    new webpack.DefinePlugin({
      __IS_SERVER__: false,
    }),
  ]),
};

module.exports = webpackMerge(common, testSpecificConfig);
