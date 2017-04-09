import * as path from 'path'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'

export default {
  entry: path.resolve(__dirname, 'src/webpackEntry.ts'),

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../public'),
    publicPath: '/',
  },

  devtool: 'cheap-module-source-map',

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
