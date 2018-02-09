const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const { zipObject, compact } = require('lodash');
const glob = require('glob');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const {
  createScriptRules,
} = require('./shared');
const {
  srcDirectory,
  testsDistDirectory,
  publicPath,
  excludedPatterns,
  cssModulesPattern,
} = require('./variables');
const { createCommonConfig } = require('./webpack.config.common');

const common = createCommonConfig();

const testFiles = glob.sync(
  '__tests__/**/*.{ts,tsx}',
  {
    cwd: srcDirectory,
    absolute: true,
  },
);

const testSpecificConfig = {
  name: 'tests',
  target: 'web',
  entry: zipObject(testFiles.map(f => `testEntry.${path.basename(f)}`), testFiles),

  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: testsDistDirectory,
    publicPath,
  },
  
  // stats: 'errors-only',
  
  performance: false,

  externals: [nodeExternals()],
  
  module: {
    rules: compact([
      // CSS Modules
      {
        test: cssModulesPattern,
        exclude: excludedPatterns,
        use: 'css-loader/locals',
      },

      // JavaScript and TypeScript
      ...createScriptRules(false),

      // Global CSS
      {
        test: /\.s?css$/,
        exclude: [...excludedPatterns, cssModulesPattern],
        use: 'css-loader/locals',
      },
    ]),
  },

  plugins: compact([
    // Required for debugging in development and for long-term caching in production
    new webpack.NamedModulesPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 1,
    }),

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
