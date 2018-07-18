const normalize = require('postcss-normalize');
const autoprefixer = require('autoprefixer');
const postCssSassParser = require('postcss-scss');

const { createBabelConfig } = require('./babel');

const { excludedPatterns, srcDirectory } = require('./variables');

const {
  isProd,
  shouldTypeCheck,
  ifProd,
} = require('@hollowverse/utils/helpers/env');

const postCssPlugins = [autoprefixer];

/**
 */
exports.createCssModulesLoaders = () => [
  {
    loader: 'css-loader',

    query: {
      minimize: isProd,
      sourceMap: true,
      modules: true,
      camelCase: 'only',
      importLoaders: 2,

      localIdentName:
        // Shorten the class name in production bundles to save some bytes
        ifProd('[hash:base64:5]') || '[name]__[local]--[hash:base64:5]',
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
      includePaths: [srcDirectory],
      sourceMap: true,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      parser: postCssSassParser,
      plugins: [normalize({ forceImport: false }), ...postCssPlugins],
    },
  },
];

/**
 * @param {object} options
 * @param {boolean} options.isNode
 */
exports.createScriptRules = (options = { isNode: false }) => {
  const babelLoader = {
    loader: 'babel-loader',
    options: createBabelConfig({ isNode: options.isNode }),
  };

  return [
    // Babel
    {
      test: /\.jsx?$/,
      exclude: excludedPatterns,
      use: babelLoader,
    },

    // TypeScript
    {
      test: /\.tsx?$/,
      exclude: excludedPatterns,
      use: [
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
      ],
    },
  ];
};
