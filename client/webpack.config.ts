import path = require('path')
import ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src/webpackEntry.ts'),

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../public'),
    publicPath: '/',
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
          },
        }, {
          loader: 'ts-loader',
        }],
      },

      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          // resolve-url-loader may be chained before sass-loader if necessary
          use: [
            'css-loader',
            'sass-loader',
          ],
        }),
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'css/styles.css',
      disable: false,
      allChunks: true,
    }),
  ],
}
