const { createBabelConfig } = require('./babel');

const { excludedPatterns } = require('./variables');

const { shouldTypeCheck } = require('@hollowverse/utils/helpers/env');

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
