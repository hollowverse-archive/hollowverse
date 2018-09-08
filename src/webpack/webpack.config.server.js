const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const slsw = require('serverless-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const path = require('path');
const { compact } = require('lodash');

const { createScriptRules } = require('./helpers');
const { createBaseConfig } = require('./createBaseConfig');

const common = createBaseConfig();

const serverSpecificConfig = {
  entry: slsw.lib.entries,
  target: 'node',
  node: {
    __dirname: true,
  },

  devtool: false,

  externals: ['express', 'http-proxy-middleware'],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          keep_classnames: true,
          compress: {
            inline: false,
          },
        },
      }),
    ],
  },

  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
  },

  stats: 'minimal',

  module: {
    rules: compact([
      // JavaScript and TypeScript
      ...createScriptRules({ isNode: true }),
    ]),
  },

  resolve: {
    modules: [path.join(__dirname, '..')],
  },

  plugins: compact([
    new webpack.IgnorePlugin(/^electron$/),
    new webpack.IgnorePlugin(/^yamlparser$/),

    // @ts-ignore
    new CopyWebpackPlugin([{ from: 'dist', to: 'dist' }]),
  ]),
};

module.exports = webpackMerge(common, serverSpecificConfig);
