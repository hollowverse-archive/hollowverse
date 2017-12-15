const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

const NameAllModulesPlugin = require('name-all-modules-plugin');

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
const common = require('./webpack.config.common');

const {
  ifProd,
  ifDev,
  ifReact,
  ifPreact,
  ifHot,
  ifPerf,
  isProd,
} = require('./env');

const extractGlobalCss = new ExtractCssChunks({
  filename: isProd ? '[name].global.[contenthash].css' : '[name].global.css',
});

const extractLocalCss = new ExtractCssChunks();

const clientSpecificConfig = {
  name: 'client',
  target: 'web',
  entry: compact([
    ifHot('webpack-hot-middleware/client'),
    ifReact(ifHot('react-hot-loader/patch')),
    ifPreact(ifDev('preact/debug')),
    path.resolve(srcDirectory, 'clientEntry.ts'),
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
      // JavaScript and TypeScript
      ...createScriptRules(false),

      // CSS Modules
      {
        test: cssModulesPattern,
        exclude: excludedPatterns,
        use: extractLocalCss.extract({
          use: createCssModulesLoaders(false),
        }),
      },

      // Global CSS
      {
        test: /\.s?css$/,
        exclude: [...excludedPatterns, cssModulesPattern],
        use: extractGlobalCss.extract({
          use: createGlobalCssLoaders(false),
        }),
      },
    ]),
  },

  plugins: compact([
    // CSS
    extractGlobalCss,
    extractLocalCss,

    new FaviconsWebpackPlugin({
      logo: path.join(srcDirectory, 'assets', 'favicon.png'),
      emitStats: true,
      statsFilename: 'iconStats.json',
      title: 'Hollowverse',
      inject: true,
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

    // Required for debugging in development and for long-term caching in production
    new webpack.NamedModulesPlugin(),

    // NOTE: Only one instance of CommonsChunkPlugin can be used
    // with server-side renderning
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.context),
    }),

    // Production-only
    ...ifProd([
      // Chunks
      // See https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
      new webpack.NamedChunksPlugin(),
      new NameAllModulesPlugin(),

      // Banner
      new webpack.BannerPlugin({
        entryOnly: true,
        banner: `${pkg.name} chunkhash:[chunkhash]`,
      }),
    ]),

    // Contains all Webpack bootstraping logic, required for `react-universal-component`
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'],
      filename: isProd ? '[name].[chunkhash].js' : '[name].js',
      minChunks: Infinity,
    }),

    ifHot(new webpack.HotModuleReplacementPlugin()),

    // Environment
    new webpack.DefinePlugin({
      __IS_SERVER__: false,
    }),
  ]),
};

module.exports = webpackMerge(common, clientSpecificConfig);
