const webpack = require('webpack');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

const path = require('path');
const fs = require('fs');
const debug = require('debug');
const compact = require('lodash/compact');
const mapValues = require('lodash/mapValues');

const autoprefixer = require('autoprefixer');
const normalize = require('postcss-normalize');

const env = require('../env');

const { ifEs5, ifEsNext, ifProd, ifDev, ifReact, ifPreact, ifHot } = env;

const pkg = require('../package.json');

const log = debug('build');

if (env.isPreact) {
  log('Building with Preact instead of React');
}

if (env.isEs5) {
  log('Building with babel-preset-es2015 instead of babel-preset-env');
}

if (!env.shouldLint) {
  log('Linting is disabled');
}

if (!env.isPerf) {
  log('Skipping performance checks!');
}

if (!env.shouldTypeCheck) {
  log('Skipping type checking!');
}

const PUBLIC_PATH = '/';

const excludedPatterns = compact([
  /node_modules/,
  ifProd(/\.test\.tsx?$/),
  ifProd(/\.test\.jsx?$/),
]);

const cssModulesPattern = /\.module\.s?css$/;

const babelConfig = {
  presets: compact([
    ...ifEs5(['es2015']),
    ...ifEsNext(
      compact([
        ...ifProd([
          [
            'minify',
            {
              removeConsole: true,
              removeDebugger: true,
              simplifyComparisons: false, // Buggy
              mangle: false, // Buggy
              simplify: false, // Buggy
            },
          ],
          ifReact('react-optimize'),
        ]),
        [
          '@babel/env',
          {
            modules: false,
            loose: true,
            debug: env.isDebug,
            targets: {
              browsers: pkg.browserslist,
            },
            useBuiltIns: 'entry',
            shippedProposals: false,
          },
        ],
      ]),
    ),
    '@babel/react',
    '@babel/stage-3',
  ]),
  plugins: compact([
    'syntax-dynamic-import',
    ...ifProd([
      // Compile gql`query { ... }` at build time to avoid runtime parsing overhead
      'graphql-tag',
      'transform-node-env-inline',
      'transform-inline-environment-variables',
    ]),
  ]),
  sourceMap: 'both',
};

// Write .babelrc to disk so that it can be used by BabelMinifyPlugin and other plugins
// that do not allow programmatic configuration via JS
fs.writeFileSync(
  path.resolve(__dirname, '.babelrc'),
  JSON.stringify(babelConfig, undefined, 2),
);

log(babelConfig);

const babelLoader = {
  loader: 'babel-loader',
  options: babelConfig,
};

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

const createSvgIconLoaders = name => [
  {
    loader: 'svg-sprite-loader',
    options: {
      extract: true,
      spriteFilename: name,
      runtimeCompat: false,
    },
  },
  ...svgLoaders,
];

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
      includePaths: [path.resolve(__dirname, 'src')],
    },
  },
];

const globalCssLoaders = [
  {
    loader: 'css-loader',
    query: {
      minimize: env.isProd,
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

const cssModuleLoaders = [
  {
    loader: 'typings-for-css-modules-loader',
    options: {
      namedExport: true,
      module: true,
      localIdentName: '[name]_[local]_[hash:base64:5]',
      minimize: env.isProd,
      sourceMap: true,
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

const extractGlobalCss = new ExtractTextPlugin({
  filename: '[name]_global.[contenthash].css',
  allChunks: true,
});

const extractCssModules = new ExtractTextPlugin({
  filename: '[name]_local.[contenthash].css',
  allChunks: true,
});

const config = {
  devServer:
    ifDev({
      port: process.env.WEBPACK_DEV_PORT || 3001,
      inline: true,
      contentBase: PUBLIC_PATH,
      hot: env.isHot,
      historyApiFallback: true,
      noInfo: true,
      quiet: false,
      stats: {
        colors: true,
      },
    }) || undefined,

  devtool: env.isDev ? 'cheap-module-source-map' : 'source-map',

  module: {
    rules: compact([
      // CSS Modules
      {
        test: cssModulesPattern,
        exclude: excludedPatterns,
        use: env.isDev
          ? ['style-loader', ...cssModuleLoaders]
          : extractCssModules.extract({
              fallback: 'style-loader',
              use: cssModuleLoaders,
            }),
      },

      // Global CSS
      {
        test: /\.s?css$/,
        exclude: [...excludedPatterns, cssModulesPattern],
        use: env.isDev
          ? ['style-loader', ...globalCssLoaders]
          : extractGlobalCss.extract({
              fallback: 'style-loader',
              use: globalCssLoaders,
            }),
      },

      // Babel
      {
        test: /\.jsx?$/,
        exclude: excludedPatterns,
        use: compact([ifReact(ifHot('react-hot-loader/webpack')), babelLoader]),
      },

      // Read source maps produced by TypeScript and Babel and merge
      // them with Webpack's source maps
      {
        test: /\.t|jsx?$/,
        exclude: excludedPatterns,
        use: ['source-map-loader'],
        enforce: 'pre',
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
              transpileOnly: !env.shouldTypeCheck,
              compilerOptions: {
                noEmitOnError: env.shouldTypeCheck,
              },
            },
          },
        ]),
      },

      // SVG Icons
      {
        test: /\.svg$/,
        exclude: excludedPatterns,
        include: [path.resolve(__dirname, 'src/icons')],
        use: createSvgIconLoaders('icons.svg'),
      },

      // SVG assets
      {
        test: /\.svg$/,
        exclude: excludedPatterns,
        include: [path.resolve(__dirname, 'src/assets')],
        use: svgLoaders,
      },
    ]),
  },

  resolve: {
    alias: Object.assign(
      {
        // Replace lodash with lodash-es for better tree shaking
        lodash: 'lodash-es',
      },
      // That's all what we need to use Preact instead of React
      ifPreact({
        react: 'preact-compat',
        'react-dom': 'preact-compat',
      }),
    ),
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      // Allow absolute imports from 'src' dir,
      // e.g. `import 'file';` instead of `'../../file';`
      // This also has to be set in `tsconfig.json`, check `compilerOptions.paths`
      path.join(__dirname, 'src'),

      // Fallback to node_modules dir
      'node_modules',
    ],
  },

  plugins: compact([
    // Development
    // Do not watch files in node_modules as this causes a huge overhead
    new webpack.WatchIgnorePlugin([/node_modules/]),

    ifHot(new webpack.HotModuleReplacementPlugin()),

    // Error handling
    new webpack.NoEmitOnErrorsPlugin(), // Required to fail the build on errors

    // Environment
    new webpack.DefinePlugin(
      mapValues(
        {
          __DEBUG__: env.isDev,
          API_ENDPOINT: process.env.API_ENDPOINT,
          'process.env.NODE_ENV': process.env.NODE_ENV,
          isHot: env.isHot,
        },
        v => JSON.stringify(v),
      ),
    ),

    new PreloadWebpackPlugin({
      rel: 'preload',
      as: 'script',
      include: 'asyncChunks',
    }),

    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: true,
    }),

    // CSS
    extractCssModules,
    extractGlobalCss,

    // SVG sprites
    new SpriteLoaderPlugin(),
  ]),
};

module.exports = config;
