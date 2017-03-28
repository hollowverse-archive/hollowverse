const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: path.resolve(__dirname, 'src/webpackEntry.ts'),

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'src')
      },

      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [
            'css-loader',
            'sass-loader'
          ]
        })
      }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },

  plugins: [
    new ExtractTextPlugin({
      filename: "css/styles.css",
      disable: false,
      allChunks: true
    })
  ]
}
