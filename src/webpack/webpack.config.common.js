const webpack = require('webpack');

const CircularDependencyPlugin = require('circular-dependency-plugin');
// const WriteFilePlugin = require('write-file-webpack-plugin');

const { compact, mapValues } = require('lodash');

const {
  srcDirectory,
  distDirectory,
  excludedPatterns,
} = require('./variables');

const { ifPreact, isHot, isDev } = require('./env');

const config = {
  // devServer:
  //   ifDev({
  //     port: process.env.WEBPACK_DEV_PORT || 3001,
  //     inline: true,
  //     contentBase: publicPath,
  //     hot: env.isHot,
  //     historyApiFallback: true,
  //     noInfo: true,
  //     quiet: false,
  //     stats: {
  //       colors: true,
  //     },
  //   }) || undefined,

  devtool: isDev ? 'cheap-module-source-map' : 'source-map',

  output: {
    path: distDirectory,
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
    ]),
  },

  resolve: {
    alias: {
      // Replace lodash with lodash-es for better tree shaking
      lodash: 'lodash-es',

      // That's all what we need to use Preact instead of React
      ...ifPreact({
        react: 'preact-compat',
        'react-dom': 'preact-compat',
      }),
    },
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      // Allow absolute imports from 'src' dir,
      // e.g. `import 'file';` instead of `'../../file';`
      // This also has to be set in `tsconfig.json`, check `compilerOptions.paths`
      srcDirectory,

      // Fallback to node_modules dir
      'node_modules',
    ],
  },

  plugins: compact([
    // Development
    // new WriteFilePlugin(),
    // Do not watch files in node_modules as this causes a huge overhead
    new webpack.WatchIgnorePlugin([/node_modules/]),

    // Error handling
    new webpack.NoEmitOnErrorsPlugin(), // Required to fail the build on errors

    // Environment
    new webpack.DefinePlugin(
      mapValues(
        {
          __DEBUG__: isDev,
          API_ENDPOINT: process.env.API_ENDPOINT,
          'process.env.NODE_ENV': process.env.NODE_ENV,
          isHot,
        },
        v => JSON.stringify(v),
      ),
    ),

    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: true,
    }),
  ]),
};

module.exports = config;
