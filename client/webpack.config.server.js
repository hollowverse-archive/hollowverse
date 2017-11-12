const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const common = require('./webpack.config.common');
const nodeExternals = require('webpack-node-externals');
// const stylelint = require('stylelint');
const autoprefixer = require('autoprefixer');
const normalize = require('postcss-normalize');

const excludedPatterns = [/node_modules/];

const cssLoaders = [
  {
    loader: 'css-loader/locals',
    query: {
      // minimize: env.isProd,
      modules: false,
      // localIdentName: '[name]__[local]--[hash:base64:5]',
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

const serverSpecificConfig = {
  name: 'server',
  target: 'node',
  externals: [
    nodeExternals({
      modulesDir: path.resolve(__dirname, '..', 'node_modules'),
      whitelist: !/\.bin|react-universal-component|webpack-flush-chunks/,
    }),
  ],
  entry: [path.resolve(__dirname, 'src/server.tsx')],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      // Global CSS
      {
        test: /\.s?css$/,
        exclude: [...excludedPatterns /* cssModulesPattern */],
        use: cssLoaders,
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};

module.exports = webpackMerge(common, serverSpecificConfig);
