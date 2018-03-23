const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const { createCommonConfig } = require('./webpack.config.common');
const { compact, mapValues } = require('lodash');

const common = createCommonConfig();

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
  createExternals,
} = require('./shared');
const { getAppGlobals } = require('./appGlobals');

const serverSpecificConfig = {
  name: 'server',
  target: 'node',
  entry: [path.join(srcDirectory, 'serverEntry.ts')],
  output: {
    // The file name should not contain any dynamic values, because
    // the require call is hardcoded in `appServer.ts`
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: serverDistDirectory,
    publicPath,
  },

  externals: createExternals(common.resolve.alias),

  module: {
    rules: compact([
      // CSS Modules
      {
        test: cssModulesPattern,
        exclude: excludedPatterns,
        use: createCssModulesLoaders(true),
      },

      // JavaScript and TypeScript
      ...createScriptRules(true),

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
    new webpack.DefinePlugin(
      mapValues(getAppGlobals(true), v => JSON.stringify(v)),
    ),

    new webpack.ProvidePlugin({
      URL: ['url', 'URL'],
      URLSearchParams: ['url', 'URLSearchParams'],
      fetch: ['node-fetch', 'default'],
    }),
  ],
};

module.exports = webpackMerge(common, serverSpecificConfig);
