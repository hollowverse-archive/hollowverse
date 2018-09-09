const webpack = require('webpack');
const path = require('path');

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const { URL } = require('url');

const { compact, mapValues } = require('lodash');

const { srcDirectory, excludedPatterns, publicPath } = require('./variables');

const { isHot, isProd } = require('@hollowverse/utils/helpers/env');
const { getAppGlobals } = require('./appGlobals');

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
    host: '0.0.0.0',
    port: 8080,
    publicPath,
    hot: isHot,
    historyApiFallback: {
      rewrites: [{ from: /./, to: `${publicPath}index.html` }],
    },
    stats: 'errors-only',
  },

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
    extensions: ['.tsx', '.ts', '.js', '.json'],
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
    new webpack.WatchIgnorePlugin([/node_modules/]),

    new SpriteLoaderPlugin(),

    new webpack.DefinePlugin(
      mapValues(getAppGlobals(), v => JSON.stringify(v)),
    ),
  ]),
});
