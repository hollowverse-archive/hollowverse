const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

const path = require('path');
const { compact, mapValues } = require('lodash');

const { createCssModulesLoaders, createScriptRules } = require('./helpers');
const {
  srcDirectory,
  clientDistDirectory,
  publicPath,
  excludedPatterns,
} = require('./variables');
const { createBaseConfig } = require('./createBaseConfig');
const { getAppGlobals } = require('./appGlobals');

const common = createBaseConfig();

const {
  ifProd,
  ifDev,
  ifPerf,
  isProd,
} = require('@hollowverse/utils/helpers/env');

const clientSpecificConfig = {
  entry: compact([
    ifDev('webpack-dev-server/client?http://localhost:8080/'),
    ifDev('webpack/hot/only-dev-server'),
    path.join(srcDirectory, 'index.tsx'),
  ]),

  output: {
    filename: isProd ? '[name].[contenthash].js' : '[name].js',
    chunkFilename: isProd ? '[name].[contenthash].js' : '[name].js',
    path: clientDistDirectory,
    publicPath,
  },

  optimization: {
    runtimeChunk: true,

    // See https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
    splitChunks: {
      name: true,
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    },
  },

  stats: 'errors-only',

  // Enforce performance limits for production build if PERF flag is set
  performance:
    ifProd(
      ifPerf({
        hints: 'error',
        maxEntrypointSize: 60000,
        maxAssetSize: 50000,
      }),
    ) || false,

  module: {
    rules: compact([
      {
        test: /\.module\.s?css/,
        exclude: excludedPatterns,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          ...createCssModulesLoaders(),
        ],
      },

      // JavaScript and TypeScript
      ...createScriptRules({ isNode: false }),
    ]),
  },

  plugins: compact([
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[contenthash].css' : '[name].css',
      chunkFilename: isProd ? '[name].[contenthash].css' : '[name].css',
    }),

    new HtmlWebpackPlugin({
      template: path.join(srcDirectory, 'index.html'),
      filename: 'index.html',
      inject: 'body',
      minify: isProd
        ? {
            html5: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
          }
        : false,
    }),

    new FaviconsWebpackPlugin({
      logo: path.join(srcDirectory, 'assets', 'favicon.png'),
      title: 'Hollowverse',
      inject: true,
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        favicons: true,
      },
    }),

    new PreloadWebpackPlugin({
      include: 'initial',
    }),

    new webpack.DefinePlugin(
      mapValues(getAppGlobals(), v => JSON.stringify(v)),
    ),

    ...ifProd([
      // @ts-ignore
      new StatsWriterPlugin({
        fields: null,
      }),
    ]),
  ]),
};

module.exports = webpackMerge(common, clientSpecificConfig);
