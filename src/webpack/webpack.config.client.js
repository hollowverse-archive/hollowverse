const webpackMerge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const {
  ifProd,
  ifDev,
  ifPerf,
  isProd,
  isDev,
} = require('@hollowverse/utils/helpers/env');

const path = require('path');
const { compact } = require('lodash');

const { createScriptRules } = require('./helpers');
const {
  srcDirectory,
  clientDistDirectory,
  publicPath,
} = require('./variables');
const { createBaseConfig } = require('./createBaseConfig');

const common = createBaseConfig();

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

  // See https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
  optimization: {
    noEmitOnErrors: true,
    // Required for debugging in development and for long-term caching in production
    namedModules: true,
    namedChunks: true,
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          comments: false,
          minimize: true,
          safari10: true, // Workaround Safari 10 bugs
          compress: {
            inline: false, // Buggy
          },
        },
      }),
    ],

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

  devtool: isDev ? 'cheap-module-source-map' : 'source-map',

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
      // JavaScript and TypeScript
      ...createScriptRules({ isNode: false }),
    ]),
  },

  plugins: compact([
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

    ...ifProd([
      // @ts-ignore
      new StatsWriterPlugin({
        fields: null,
      }),
    ]),
  ]),
};

module.exports = webpackMerge(common, clientSpecificConfig);
