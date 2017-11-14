const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const common = require('./webpack.config.common');
const nodeExternals = require('webpack-node-externals');
const compact = require('lodash/compact');

const {
  srcDirectory,
  excludedPatterns,
  cssModulesPattern,
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
  externals: [
    nodeExternals({
      modulesDir: path.resolve(srcDirectory, '..', '..', 'node_modules'),
      whitelist: !/\.bin|react-universal-component|webpack-flush-chunks/,
    }),
  ],
  entry: [path.resolve(srcDirectory, 'serverEntry.ts')],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: compact([
      // JavaScript and TypeScript
      ...createScriptRules(true),

      // CSS Modules
      {
        test: cssModulesPattern,
        exclude: excludedPatterns,
        use: createCssModulesLoaders(false),
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
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};

module.exports = webpackMerge(common, serverSpecificConfig);
