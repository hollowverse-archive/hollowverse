const webpack = require('webpack');
const path = require('path');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { URL } = require('url');

const { compact, mapValues } = require('lodash');

const { srcDirectory, excludedPatterns, publicPath } = require('./variables');

const {
  isHot,
  isDev,
  ifProd,
  isProd,
  ifEsNext,
} = require('@hollowverse/utils/helpers/env');

const { API_ENDPOINT = 'https://api.hollowverse.com/graphql' } = process.env;

module.exports.createBaseConfig = () => ({
  mode: isProd ? 'production' : 'development',
  devServer: {
    proxy: {
      '/__api': {
        target: API_ENDPOINT,
        secure: false,
        logLevel: 'error',
        pathRewrite: { '^/api': '' },
        headers: {
          host: new URL(API_ENDPOINT).host,
        },
      },
    },
    port: 8080,
    publicPath,
    hot: isHot,
    historyApiFallback: {
      rewrites: [{ from: /./, to: `${publicPath}index.html` }],
    },
    stats: 'errors-only',
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          comments: false,
          minimize: true,
          safari10: true,
          compress: {
            inline: false,
          },
        },
      }),
    ],
  },

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
        use: [
          {
            loader: 'raw-loader',
            options: {
              output: 'string',
              removeUnusedFragments: true,
            },
          },
          {
            loader: 'pattern-replace-loader',
            options: {
              multiple: [
                { search: '#.*\n', flags: 'gi', replace: '' },
                { search: '[\\s|,]*\n+[\\s|,]*', flags: 'gi', replace: ' ' },
              ],
            },
          },
        ],
      },

      {
        test: /\.html?$/,
        exclude: excludedPatterns,
        use: {
          loader: 'html-loader',
          options: {
            minimize: isProd,
            interpolate: false,
          },
        },
      },

      // SVG assets
      {
        test: /\.svg$/,
        exclude: excludedPatterns,
        include: [srcDirectory],
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: isProd ? 'icons.[hash].svg' : 'icons.svg',
              esModule: false,
            },
          },
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

  plugins: compact([
    // Development
    // Do not watch files in node_modules as this causes a huge overhead
    new webpack.WatchIgnorePlugin([
      /node_modules/,

      // Ignore auto-generated type definitions for CSS module files
      /\.s?css\.d\.ts$/,
    ]),

    // Error handling
    new webpack.NoEmitOnErrorsPlugin(), // Required to fail the build on errors

    // Environment
    new webpack.DefinePlugin(
      mapValues(
        {
          'process.env.NODE_ENV': process.env.NODE_ENV,
        },
        v => JSON.stringify(v),
      ),
    ),

    new SpriteLoaderPlugin(),

    ...ifProd([
      new LodashModuleReplacementPlugin(),

      new webpack.optimize.OccurrenceOrderPlugin(true),

      // Scope hoisting a la Rollup (Webpack 3+)
      new webpack.optimize.ModuleConcatenationPlugin(),

      ...ifEsNext([
        new BabelMinifyPlugin({
          removeConsole: true,
          removeDebugger: true,
        }),
      ]),
    ]),

    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
    }),
  ]),
});
