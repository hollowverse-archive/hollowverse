const webpack = require('webpack');
const LoaderTargetPlugin = require('webpack/lib/LoaderTargetPlugin');
const FunctionModulePlugin = require('webpack/lib/FunctionModulePlugin');
const JsonpTemplatePlugin = require('webpack/lib/JsonpTemplatePlugin');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
const webpackMerge = require('webpack-merge');
const StatsPlugin = require('stats-webpack-plugin');

const { compact } = require('lodash');
const path = require('path');
const WildcardsEntryWebpackPlugin = require('wildcards-entry-webpack-plugin');

const {
  createScriptRules,
  createGlobalCssLoaders,
  createCssModulesLoaders,
  createExternals,
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

const testSpecificConfig = {
  name: 'tests',

  // The environment provided by Jest is kind of a Node.js/Browser hybrid:
  // we can `require` built-in Node.js modules like `fs` and `path` and we
  // can also access `window` and other DOM APIs.
  // The `target` configuration below allows us to emulate this hybrid environment
  // in Webpack so modules expecting either type of environment can still work.
  //
  // See https://webpack.js.org/configuration/target/
  // See https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsApply.js#L70-L185
  // @ts-ignore
  target: compiler => {
    new JsonpTemplatePlugin().apply(compiler);
    new FunctionModulePlugin(testSpecificConfig.output).apply(compiler);
    new NodeTargetPlugin().apply(compiler);
    new LoaderTargetPlugin('web').apply(compiler);
  },

  // This plugin watches for newly added test files and
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
      ...createScriptRules(false),

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
            minimize: false,
            interpolate: false,
          },
        },
      },
    ]),
  },

  // Do not mock built-in node modules and global
  // The actual ones will be available (and needed) in
  // Jest environment
  node: false,

  plugins: compact([
    new StatsPlugin('stats.json', {
      chunkModules: true,
    }),

    new WildcardsEntryWebpackPlugin(),

    // Required for debugging in development and for long-term caching in production
    new webpack.NamedModulesPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2,
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
