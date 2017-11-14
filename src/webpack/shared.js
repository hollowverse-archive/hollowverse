const normalize = require('postcss-normalize');
const autoprefixer = require('autoprefixer');

const { srcDirectory } = require('./variables');

const { isProd } = require('./env');

const sassLoaders = [
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
      includePaths: [srcDirectory],
    },
  },
];

exports.createGlobalCssLoaders = (isServer = false) => [
  {
    loader: isServer ? 'css-loader/locals' : 'css-loader',
    query: {
      minimize: isProd,
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
  ...sassLoaders,
];

exports.createCssModulesLoaders = (isServer = false) => [
  {
    loader: isServer ? 'css-loader/locals' : 'css-loader',
    query: {
      minimize: isProd,
      sourceMap: true,
      modules: true,
      localIdentName: '[name]__[local]--[hash:base64:5]',
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      plugins: [
        // @WARN Do not include `normalize`
        autoprefixer,
      ],
    },
  },
  ...sassLoaders,
];
