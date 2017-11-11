const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const common = require('./webpack.config.common');

const serverSpecificConfig = {
  name: 'server',
  target: 'node',
  entry: [path.resolve(__dirname, 'src/server.tsx')],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};

module.exports = webpackMerge(common, serverSpecificConfig);
