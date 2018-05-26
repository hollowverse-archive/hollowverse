const { compact } = require('lodash');

const {
  ifProd,
  isTest,
  ifTest,
  createConditionalWithFallback,
} = require('@hollowverse/utils/helpers/env');

const ifNotTest = createConditionalWithFallback(!isTest);

module.exports.createBabelConfig = () => ({
  presets: compact([
    [
      '@babel/preset-es2015',
      {
        modules: isTest ? 'commonjs' : false,
        loose: false,
      },
    ],
    '@babel/preset-stage-3',
    '@babel/preset-react',
  ]),
  plugins: compact([
    'lodash',
    ...ifNotTest(['react-hot-loader/babel']),
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    ifTest('babel-plugin-dynamic-import-node'),
    ...ifProd([
      [
        'transform-inline-environment-variables',
        {
          // Do not inline the following environment variables
          // so that we can toggle this variable at runtime without
          // having to re-build
          exclude: ['NO_PROXY'],
        },
      ],
    ]),
  ]),
  ...ifNotTest({ sourceMap: 'both' }),
  retainLines: true,
});
