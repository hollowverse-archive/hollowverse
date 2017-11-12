// const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

// const WebpackHTMLPlugin = require('html-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

// const NameAllModulesPlugin = require('name-all-modules-plugin');
// const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
// const PreloadWebpackPlugin = require('preload-webpack-plugin');

const path = require('path');
const compact = require('lodash/compact');

// const stylelint = require('stylelint');
const autoprefixer = require('autoprefixer');
const normalize = require('postcss-normalize');

const env = require('../env');
const common = require('./webpack.config.common');

const {
  // ifEs5,
  // ifEsNext,
  // ifLint,
  ifProd,
  ifDev,
  ifReact,
  ifPreact,
  ifHot,
  ifPerf,
} = env;

// const pkg = require('../package.json');

const svgoConfig = {
  plugins: [
    { removeXMLNS: false },
    { cleanupIDs: false },
    { convertShapeToPath: false },
    { removeEmptyContainers: false },
    { removeViewBox: false },
    { mergePaths: false },
    { convertStyleToAttrs: false },
    { convertPathData: false },
    { convertTransform: false },
    { removeUnknownsAndDefaults: false },
    { collapseGroups: false },
    { moveGroupAttrsToElems: false },
    { moveElemsAttrsToGroup: false },
    { cleanUpEnableBackground: false },
    { removeHiddenElems: false },
    { removeNonInheritableGroupAttrs: false },
    { removeUselessStrokeAndFill: false },
    { transformsWithOnePath: false },
  ],
};

const svgLoaders = [
  {
    loader: 'svgo-loader',
    options: svgoConfig,
  },
];

const createSvgIconLoaders = name => [
  {
    loader: 'svg-sprite-loader',
    options: {
      extract: true,
      spriteFilename: name,
      runtimeCompat: false,
    },
  },
  ...svgLoaders,
];

const sassLoaders = [
  {
    loader: 'resolve-url-loader',
    options: {
      sourceMap: true,
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      includePaths: [path.resolve(__dirname, 'src')],
    },
  },
];

const globalCssLoaders = [
  {
    loader: 'css-loader',
    query: {
      minimize: env.isProd,
      sourceMap: true,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: [normalize({ forceImport: true }), autoprefixer()],
      sourceMap: true,
    },
  },
  ...sassLoaders,
];

// const cssModuleLoaders = [
//   {
//     loader: 'typings-for-css-modules-loader',
//     options: {
//       namedExport: true,
//       module: true,
//       localIdentName: '[name]_[local]_[hash:base64:5]',
//       minimize: env.isProd,
//       sourceMap: true,
//     },
//   },
//   {
//     loader: 'postcss-loader',
//     options: {
//       sourceMap: true,
//       plugins: [
//         // @WARN Do not include `normalize`
//         autoprefixer,
//       ],
//     },
//   },
//   ...sassLoaders,
// ];

const extractCssChunks = new ExtractCssChunks();

// const extractCssModules = new ExtractCssChunks({
//   filename: '[name]_local.[contenthash].css',
//   allChunks: true,
// });

const excludedPatterns = compact([
  /node_modules/,
  ifProd(/\.test\.tsx?$/),
  ifProd(/\.test\.jsx?$/),
]);

// const cssModulesPattern = /\.module\.s?css$/;

const PUBLIC_PATH = '/';

const clientSpecificConfig = {
  name: 'client',
  target: 'web',
  entry: compact([
    ifReact(ifHot('react-hot-loader/patch')),
    ifPreact(ifDev('preact/devtools')),
    ifProd('regenerator-runtime/runtime'),
    path.resolve(__dirname, 'src/webpackEntry.ts'),
  ]),

  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: PUBLIC_PATH,
  },

  // Stats require that this property contains details about assets
  stats: env.isStats ? undefined : 'errors-only',

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
      // // Stylelint
      // ifLint(
      //   ifProd({
      //     test: /\.s?css$/,
      //     exclude: excludedPatterns,
      //     enforce: 'pre',
      //     use: {
      //       loader: 'postcss-loader',
      //       options: {
      //         plugins: [stylelint],
      //       },
      //     },
      //   }),
      // ),

      // // ESLint
      // ifLint(
      //   ifProd({
      //     test: /\.jsx?$/,
      //     exclude: excludedPatterns,
      //     enforce: 'pre',
      //     use: [
      //       {
      //         loader: 'eslint-loader',
      //         query: {
      //           failOnError: env.isProd,
      //           failOnWarning: env.isProd,
      //           fix: env.isProd,
      //         },
      //       },
      //     ],
      //   }),
      // ),

      // // TSLint
      // ifLint(
      //   ifProd({
      //     test: /\.tsx?$/,
      //     exclude: excludedPatterns,
      //     enforce: 'pre',
      //     use: [
      //       {
      //         loader: 'tslint-loader',
      //         options: {
      //           emitErrors: env.isProd,
      //           failOnHint: env.isProd,
      //           typeCheck: env.isProd,
      //           fix: false,
      //         },
      //       },
      //     ],
      //   }),
      // ),

      // CSS Modules
      // {
      //   test: cssModulesPattern,
      //   exclude: excludedPatterns,
      //   use: env.isDev
      //     ? ['style-loader', ...cssModuleLoaders]
      //     : extractCssModules.extract({
      //         fallback: 'style-loader',
      //         use: cssModuleLoaders,
      //       }),
      // },

      // Global CSS
      {
        test: /\.s?css$/,
        exclude: [...excludedPatterns /* cssModulesPattern */],
        use: ExtractCssChunks.extract({
          use: globalCssLoaders,
        }),
      },

      // // SVG Icons
      // {
      //   test: /\.svg$/,
      //   exclude: excludedPatterns,
      //   include: [path.resolve(__dirname, 'src/icons')],
      //   use: createSvgIconLoaders('icons.svg'),
      // },

      // // SVG assets
      // {
      //   test: /\.svg$/,
      //   exclude: excludedPatterns,
      //   include: [path.resolve(__dirname, 'src/assets')],
      //   use: svgLoaders,
      // },
    ]),
  },

  plugins: compact([
    // HTML index
    // new WebpackHTMLPlugin({
    //   filename: 'index.html',
    //   template: path.resolve(__dirname, 'src/index.html'),
    //   inject: 'body',
    //   minify: env.isProd
    //     ? {
    //         html5: true,
    //         collapseBooleanAttributes: true,
    //         collapseInlineTagWhitespace: true,
    //         collapseWhitespace: true,
    //       }
    //     : false,
    // }),

    // CSS
    // extractCssModules,
    extractCssChunks,

    // new PreloadWebpackPlugin({
    //   rel: 'preload',
    //   as: 'script',
    //   include: 'asyncChunks',
    // }),

    // Required for debugging in development and for long-term caching in production
    // new webpack.NamedModulesPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].js',
      minChunks: Infinity,
    }),

    // SVG sprites
    // new SpriteLoaderPlugin(),

    // Production-only
    // ...ifProd([
    //   // Chunks

    //   // See https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
    //   new webpack.NamedChunksPlugin(),
    //   new NameAllModulesPlugin(),

    //   // The order of the following instances is important
    //   // This chunk contains all vendor code, except React and related libraries
    //   new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendor',
    //     minChunks: module => /node_modules/.test(module.context),
    //   }),

    //   // This chunk contains Apollo Client libraries
    //   //
    //   // Wondering why we need to match for `/p?react/i` too?
    //   // See https://github.com/webpack/webpack/issues/4638#issuecomment-292583989
    //   new webpack.optimize.CommonsChunkPlugin({
    //     name: 'apollo',
    //     minChunks: module =>
    //       /node_modules/.test(module.context) &&
    //       (/p?react/i.test(module.context) || /apollo/i.test(module.context)),
    //   }),

    //   // This chunk contains React/Preact and all related libraries
    //   new webpack.optimize.CommonsChunkPlugin({
    //     name: 'react',
    //     minChunks: module =>
    //       /node_modules/.test(module.context) &&
    //       /p?react/i.test(module.context),
    //   }),

    //   new webpack.optimize.CommonsChunkPlugin({
    //     async: true,
    //     minChunks: Infinity,
    //   }),

    //   // Make a separate manifest chunk for better long-term caching
    //   new webpack.optimize.CommonsChunkPlugin({
    //     name: 'manifest',
    //     minChunks: Infinity,
    //   }),

    //   // Merge modules duplicated across multiple chunks
    //   // new webpack.optimize.AggressiveMergingPlugin({
    //   //   moveToParents: true,
    //   // }),

    //   new webpack.optimize.OccurrenceOrderPlugin(true),

    //   // Scope hoisting a la Rollup (Webpack 3+)
    //   new webpack.optimize.ModuleConcatenationPlugin(),

    //   // Minification
    //   ...ifEs5([
    //     new webpack.optimize.UglifyJsPlugin({
    //       minimize: true,
    //       comments: false,
    //       sourceMap: true,
    //     }),
    //   ]),

    //   ...ifEsNext([new BabelMinifyPlugin()]),

    //   // Banner
    //   new webpack.BannerPlugin({
    //     entryOnly: true,
    //     banner: `${pkg.displayName ||
    //       pkg.name} hash:[hash], chunkhash:[chunkhash], name:[name]`,
    //   }),
    // ]),
  ]),
};

module.exports = webpackMerge(common, clientSpecificConfig);
