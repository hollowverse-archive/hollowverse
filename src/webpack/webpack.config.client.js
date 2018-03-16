const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
// const PreloadWebpackPlugin = require('preload-webpack-plugin');

const path = require('path');
const compact = require('lodash/compact');

const {
  createGlobalCssLoaders,
  createCssModulesLoaders,
  createScriptRules,
} = require('./shared');
const {
  srcDirectory,
  clientDistDirectory,
  pkg,
  publicPath,
  excludedPatterns,
  cssModulesPattern,
} = require('./variables');
const { createCommonConfig } = require('./webpack.config.common');

const common = createCommonConfig();

const { ifProd, ifDev, ifPreact, ifHot, ifPerf, isProd } = require('./env');

const extractGlobalCss = new MiniCssExtractPlugin({
  filename: isProd ? '[name].global.[contenthash].css' : '[name].global.css',
  chunkFilename: '[id].css',
});

const extractLocalCss = new MiniCssExtractPlugin({
  filename: isProd ? '[name].module.[contenthash].css' : '[name].module.css',
  chunkFilename: '[id].css',
});

const clientSpecificConfig = {
  name: 'client',
  target: 'web',
  entry: compact([
    ifHot('webpack-hot-middleware/client'),
    ifPreact(ifDev('preact/debug')),
    path.join(srcDirectory, 'clientEntry.ts'),
  ]),

  output: {
    filename: isProd ? '[name].[chunkhash].js' : '[name].js',
    chunkFilename: isProd ? '[name].[chunkhash].js' : '[name].js',
    path: clientDistDirectory,
    publicPath,
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
      // CSS Modules
      {
        test: cssModulesPattern,
        exclude: excludedPatterns,
        use: [MiniCssExtractPlugin.loader, ...createCssModulesLoaders(false)],
      },

      // JavaScript and TypeScript
      ...createScriptRules(false),

      // Global CSS
      {
        test: /\.s?css$/,
        exclude: [...excludedPatterns, cssModulesPattern],
        use: [MiniCssExtractPlugin.loader, ...createGlobalCssLoaders(false)],
      },
    ]),
  },

  plugins: compact([
    // CSS
    extractGlobalCss,
    extractLocalCss,

    new HtmlWebpackPlugin({
      template: path.join(srcDirectory, 'index.client.html'),
      filename: 'index.html',
      inject: 'body',
      alwaysWriteToDisk: true,
      minify: isProd
        ? {
            html5: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
          }
        : false,
    }),

    new HtmlWebpackHarddiskPlugin(),

    // new PreloadWebpackPlugin({
    //   include: 'initial',
    // }),

    // Production-only
    ...ifProd([
      // Banner
      new webpack.BannerPlugin({
        entryOnly: true,
        banner: `${pkg.name} chunkhash:[chunkhash]`,
      }),
    ]),

    ifHot(new webpack.HotModuleReplacementPlugin()),

    // Environment
    new webpack.DefinePlugin({
      __IS_SERVER__: false,
    }),
  ]),
};

module.exports = webpackMerge(common, clientSpecificConfig);
