const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const NameAllModulesPlugin = require('name-all-modules-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

// const extractGlobalCss = new ExtractTextPlugin({
//   allChunks: true,
//   filename: '[name].global.[md5:contenthash:hex:20].css',
// });

// const extractCssModules = new ExtractTextPlugin({
//   allChunks: true,
//   filename: '[name].module.[md5:contenthash:hex:20].css',
// });

const path = require('path');
const { compact, mapValues } = require('lodash');

const {
  createGlobalCssLoaders,
  createCssModulesLoaders,
  createScriptRules,
} = require('./shared');
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
    ifDev('webpack-dev-server/client?http://localhost:3001/'),
    ifDev('webpack/hot/only-dev-server'),
    path.join(srcDirectory, 'index.ts'),
  ]),

  output: {
    filename: isProd ? '[name].[chunkhash].js' : '[name].js',
    chunkFilename: isProd ? '[name].[chunkhash].js' : '[name].js',
    path: clientDistDirectory,
    publicPath,
  },

  optimization: {
    // Required for debugging in development and for long-term caching in production
    namedModules: true,
    namedChunks: true,
    runtimeChunk: true,

    // See https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
    splitChunks: {
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
        test: /\.s?css/,
        exclude: excludedPatterns,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          ...createCssModulesLoaders({ isNode: false }),
        ],
      },

      // JavaScript and TypeScript
      ...createScriptRules({ isNode: false }),
    ]),
  },

  plugins: compact([
    // new FaviconsWebpackPlugin({
    //   logo: path.join(srcDirectory, 'assets', 'favicon.png'),
    //   title: 'Hollowverse',
    //   inject: true,
    // }),
    // Required for debugging in development and for long-term caching in production
    new webpack.NamedModulesPlugin(),

    // extractGlobalCss,

    // extractCssModules,

    new MiniCssExtractPlugin({
      filename: isProd
        ? '[name].module.[contenthash].css'
        : '[name].module.css',
      chunkFilename: isProd
        ? '[name].module.[contenthash].css'
        : '[name].module.css',
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

    new PreloadWebpackPlugin({
      include: 'initial',
    }),

    // Production-only
    ...ifProd([
      // See https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
      new webpack.NamedChunksPlugin(),
      new NameAllModulesPlugin(),
      // Banner
      new webpack.BannerPlugin({
        entryOnly: true,
        banner: 'chunkhash:[chunkhash]',
      }),
    ]),

    // Environment
    new webpack.DefinePlugin(
      mapValues(getAppGlobals(), v => JSON.stringify(v)),
    ),
  ]),
};

module.exports = webpackMerge(common, clientSpecificConfig);
