const webpack = require('webpack');
const path = require('path');

const CircularDependencyPlugin = require('circular-dependency-plugin');

const { compact, mapValues } = require('lodash');

const { srcDirectory, excludedPatterns, publicPath } = require('./variables');

const { ifPreact, isHot, isDev, isDebug, ifDev } = require('./env');

const svgoConfig = {
  plugins: [
    { removeXMLNS: false },
    { cleanupIDs: false },
    { convertShapeToPath: false },
    { removeEmptyContainers: false },
    { removeViewBox: false },
    { mergePaths: false },
    { convertStyleToAttrs: false },
    { convertPathData: false },
    { convertTransform: false },
    { removeUnknownsAndDefaults: false },
    { collapseGroups: false },
    { moveGroupAttrsToElems: false },
    { moveElemsAttrsToGroup: false },
    { cleanUpEnableBackground: false },
    { removeHiddenElems: false },
    { removeNonInheritableGroupAttrs: false },
    { removeUselessStrokeAndFill: false },
    { transformsWithOnePath: false },
  ],
};

const svgLoaders = [
  {
    loader: 'svgo-loader',
    options: svgoConfig,
  },
];

// const createSvgIconLoaders = (/** @type {string} */ name) => [
//   {
//     loader: 'svg-sprite-loader',
//     options: {
//       extract: true,
//       spriteFilename: name,
//       runtimeCompat: false,
//     },
//   },
//   ...svgLoaders,
// ];

const config = {
  devServer:
    ifDev({
      port: process.env.WEBPACK_DEV_PORT || 3001,
      inline: true,
      contentBase: publicPath,
      hot: isHot,
      historyApiFallback: true,
      noInfo: true,
      quiet: false,
      stats: {
        colors: true,
      },
    }) || undefined,

  devtool: isDev ? 'cheap-module-source-map' : 'source-map',

  module: {
    rules: compact([
      // Read source maps produced by TypeScript and Babel and merge
      // them with Webpack's source maps
      {
        test: /\.t|jsx?$/,
        exclude: excludedPatterns,
        use: ['source-map-loader'],
        enforce: 'pre',
      },

      // // SVG assets
      {
        test: /\.svg$/,
        exclude: excludedPatterns,
        include: [path.resolve(srcDirectory)],
        use: ['url-loader', ...svgLoaders],
      },
    ]),
  },

  resolve: {
    alias: {
      // Replace lodash with lodash-es for better tree shaking
      lodash: 'lodash-es',

      // That's all what we need to use Preact instead of React
      ...ifPreact({
        react: 'preact-compat',
        'react-dom': 'preact-compat',
      }),
    },
    extensions: ['.tsx', '.ts', '.js', '.css', '.scss', '.module.scss'],
    modules: [
      // Allow absolute imports from 'src' dir,
      // e.g. `import 'file';` instead of `'../../file';`
      // This also has to be set in `tsconfig.json`, check `compilerOptions.paths`
      srcDirectory,

      // Fallback to node_modules dir
      path.join(process.cwd(), 'node_modules'),
    ],
  },

  plugins: compact([
    // Development
    // Do not watch files in node_modules as this causes a huge overhead
    new webpack.WatchIgnorePlugin([
      /node_modules/,

      // Ignore auto-generated type definitions for CSS module files
      /\.s?css\.d\.ts$/,
    ]),

    // Error handling
    new webpack.NoEmitOnErrorsPlugin(), // Required to fail the build on errors

    // Environment
    new webpack.DefinePlugin(
      mapValues(
        {
          __DEBUG__: isDev || isDebug,
          API_ENDPOINT: process.env.API_ENDPOINT,
          'process.env.NODE_ENV': process.env.NODE_ENV,
          isHot,
        },
        v => JSON.stringify(v),
      ),
    ),

    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
    }),
  ]),
};

module.exports = config;
