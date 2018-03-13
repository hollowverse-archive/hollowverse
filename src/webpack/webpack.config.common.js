const webpack = require('webpack');
const path = require('path');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const { compact, mapValues } = require('lodash');

const { srcDirectory, excludedPatterns, publicPath } = require('./variables');

const {
  ifPreact,
  isHot,
  isDev,
  isDebug,
  ifDev,
  ifProd,
  isProd,
  ifEsNext,
  isEs5,
} = require('./env');

module.exports.createCommonConfig = () => ({
  mode: isProd ? 'production' : 'development',

  devServer:
    ifDev({
      port: process.env.WEBPACK_DEV_PORT || 3001,
      publicPath,
      hot: isHot,
      historyApiFallback: true,
      stats: {
        colors: true,
        all: false,
        errors: true,
        errorDetails: true,
        warnings: true,
      },
    }) || undefined,

  devtool: isDev ? 'cheap-module-source-map' : 'source-map',

  module: {
    rules: compact([
      // Read source maps produced by TypeScript and Babel and merge
      // them with Webpack's source maps
      {
        test: /\.t|jsx?$/,
        exclude: excludedPatterns,
        use: ['source-map-loader'],
        enforce: 'pre',
      },

      {
        test: /\.(graphql|gql)$/,
        exclude: excludedPatterns,
        loader: 'graphql-tag/loader',
      },

      // SVG assets
      {
        test: /\.svg$/,
        exclude: excludedPatterns,
        include: [srcDirectory],
        use: [
          'url-loader',
          // {
          //   loader: 'svg-sprite-loader',
          //   options: {
          //     extract: true,
          //     spriteFilename: isProd ? 'icons.[hash].svg' : 'icons.svg',
          //     esModule: false,
          //   },
          // },
          {
            loader: 'svgo-loader',
            options: {
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
            },
          },
        ],
      },
    ]),
  },

  resolve: {
    alias: {
      // Replace lodash with lodash-es for better tree shaking
      lodash: 'lodash-es',

      algoliasearch: 'algoliasearch/lite',

      'es6-promise': 'empty-module',

      // That's all what we need to use Preact instead of React
      ...ifPreact({
        react: 'preact-compat',
        'react-dom': 'preact-compat',
      }),
    },
    extensions: ['.tsx', '.ts', '.js', '.css', '.scss', '.module.scss'],
    modules: [
      // Allow absolute imports from 'src' dir,
      // e.g. `import 'file';` instead of `'../../file';`
      // This also has to be set in `tsconfig.json`, check `compilerOptions.paths`
      srcDirectory,

      // Fallback to node_modules dir
      path.join(process.cwd(), 'node_modules'),
    ],
  },

  optimization: {
    minimize: isEs5,
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
    },
  },

  plugins: compact([
    // Development
    // Do not watch files in node_modules as this causes a huge overhead
    new webpack.WatchIgnorePlugin([
      /node_modules/,

      // Ignore auto-generated type definitions for CSS module files
      /\.s?css\.d\.ts$/,
    ]),

    // Environment
    new webpack.DefinePlugin(
      mapValues(
        {
          __IS_DEBUG__: isDebug,
          __BRANCH__: process.env.BRANCH,
          __COMMIT_ID__: process.env.COMMIT_ID,
          __BASE__: isProd
            ? 'https://hollowverse.com'
            : `http://localhost:${process.env.APP_SERVER_PORT || 3001}`,

          // To avoid issues with cross-origin requests in development,
          // the API endpoint is mapped to an endpoint on the same origin
          // which proxies the requests to the actual defined endpoint
          // The proxy is defined in appServer.ts
          __API_ENDPOINT__: isProd ? process.env.API_ENDPOINT : '/__api',
          'process.env.NODE_ENV': process.env.NODE_ENV,
          isHot,
        },
        v => JSON.stringify(v),
      ),
    ),

    new SpriteLoaderPlugin(),

    ...ifProd([
      new LodashModuleReplacementPlugin(),
      ...ifEsNext([new BabelMinifyPlugin()]),
    ]),

    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
    }),
  ]),
});
