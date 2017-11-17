const normalize = require('postcss-normalize');
const autoprefixer = require('autoprefixer');
const { compact } = require('lodash');

const { createBabelConfig } = require('./babel');

const { srcDirectory, excludedPatterns } = require('./variables');

const { ifReact, ifHot, isProd, shouldTypeCheck } = require('./env');

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
      modules: false,
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
      localIdentName: isProd
        ? '[hash:base64:5]'
        : '[name]__[local]--[hash:base64:5]',
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

exports.createScriptRules = (isServer = false) => {
  const babelLoader = {
    loader: 'babel-loader',
    options: createBabelConfig(isServer),
  };

  return [
    // Babel
    {
      test: /\.jsx?$/,
      exclude: excludedPatterns,
      use: compact([ifReact(ifHot('react-hot-loader/webpack')), babelLoader]),
    },

    // TypeScript
    {
      test: /\.tsx?$/,
      exclude: excludedPatterns,
      use: compact([
        ifReact(ifHot('react-hot-loader/webpack')),
        babelLoader,
        {
          loader: 'ts-loader',
          options: {
            silent: true,
            transpileOnly: !shouldTypeCheck,
            compilerOptions: {
              noEmitOnError: shouldTypeCheck,
            },
          },
        },
      ]),
    },
  ];
};
