const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const common = require('./webpack.config.common');
const nodeExternals = require('webpack-node-externals');
const compact = require('lodash/compact');

const {
  srcDirectory,
  serverDistDirectory,
  excludedPatterns,
  cssModulesPattern,
  publicPath,
} = require('./variables');
const { isProd } = require('./env');
const {
  createGlobalCssLoaders,
  createCssModulesLoaders,
  createScriptRules,
} = require('./shared');

const serverSpecificConfig = {
  name: 'server',
  target: 'node',
  entry: [path.resolve(srcDirectory, 'serverEntry.ts')],
  output: {
    // The file name should not contain any dynamic values, because
    // the require call is hardcoded in `appServer.ts`
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: serverDistDirectory,
    publicPath,
  },

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
      // JavaScript and TypeScript
      ...createScriptRules(true),

      // CSS Modules
      {
        test: cssModulesPattern,
        exclude: excludedPatterns,
        use: createCssModulesLoaders(true),
      },

      // Global CSS
      {
        test: /\.s?css$/,
        exclude: [...excludedPatterns, cssModulesPattern],
        use: createGlobalCssLoaders(true),
      },

      {
        test: /\.html?$/,
        exclude: [...excludedPatterns],
        use: {
          loader: 'html-loader',
          options: {
            minimize: isProd,
            interpolate: false,
          },
        },
      },
    ]),
  },
  plugins: [
    // We only need one JS file on the server
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),

    // Environment
    new webpack.DefinePlugin({
      __IS_SERVER__: true,
    }),
  ],
};

module.exports = webpackMerge(common, serverSpecificConfig);
