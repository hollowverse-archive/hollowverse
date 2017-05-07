import * as path from 'path'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import * as CircularDependencyPlugin from 'circular-dependency-plugin'

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
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
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
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: true,
    }),
  ],
}
