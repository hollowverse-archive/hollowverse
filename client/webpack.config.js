const webpack = require('webpack');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackHTMLPlugin = require('html-webpack-plugin');

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

const path = require('path');
const fs = require('fs');
const debug = require('debug');
const compact = require('lodash/compact');

const autoprefixer = require('autoprefixer');
const stylelint = require('stylelint');
const normalize = require('postcss-normalize');

const env = require('../env');

const {
  ifEs5,
  ifEsNext,
  ifLint,
  ifProd,
  ifDev,
  ifReact,
  ifPreact,
  ifHot,
  ifTest,
  ifPerf,
} = env;

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

const BUILD_PATH = path.resolve(__dirname, '../public');
const PUBLIC_PATH = env.isProd ? '' : '/';

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
            'babili',
            {
              removeConsole: true,
              removeDebugger: true,
              mangle: false, // Buggy
              simplify: false, // Buggy
            },
          ],
          ifReact('react-optimize'),
        ]),
        [
          'env',
          {
            modules: false,
            loose: true,
            debug: env.isDev,
            targets: {
              browsers: pkg.browserslist,
            },
            useBuiltIns: true,
          },
        ],
      ]),
    ),
    'react',
    'stage-3',
  ]),
  plugins: compact([
    'syntax-dynamic-import',
    ...ifProd([
      'transform-node-env-inline',
      'transform-inline-environment-variables',
    ]),
  ]),
  sourceMaps: 'both',
};

// Write .babelrc to disk so that it can be used by BabiliPlugin and other plugins
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
    { removeXMLNS: true },
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

const createSvgIconLoaders = name => [
  {
    loader: 'svg-sprite-loader',
    options: {
      extract: true,
      spriteFilename: name,
      runtimeCompat: false,
    },
  },
  {
    loader: 'svgo-loader',
    options: svgoConfig,
  },
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
      plugins: [normalize(), autoprefixer()],
      sourceMap: true,
    },
  },
  ...sassLoaders,
];

const CssModuleLoaders = [
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
  entry: {
    app: compact([
      ifReact(ifHot('react-hot-loader/patch')),
      ifPreact(ifDev('preact/devtools')),
      ifHot('webpack-hot-middleware/client'),
      path.resolve(__dirname, 'src/webpackEntry.ts'),
    ]),
  },

  output: {
    filename: ifProd('[name]_[chunkhash].js') || '[name]_[hash].js',
    path: BUILD_PATH,
    publicPath: PUBLIC_PATH,
  },

  devServer:
    ifDev({
      inline: true,
      contentBase: PUBLIC_PATH,
      hot: env.isHot,
      historyApiFallback: true,
    }) || undefined,

  devtool: env.isDev ? 'cheap-module-source-map' : 'source-map',

  // Enforce performance limits for production build if PERF flag is set
  performance:
    ifProd(
      ifPerf({
        hints: 'error',
        maxEntrypointSize: 60000,
        maxAssetSize: 50000,
      }),
    ) || false,

  module: {
    rules: compact([
      // Stylelint
      ifLint(
        ifProd({
          test: /\.s?css$/,
          exclude: excludedPatterns,
          enforce: 'pre',
          use: {
            loader: 'postcss-loader',
            options: {
              plugins: [stylelint],
            },
          },
        }),
      ),

      // CSS Modules
      {
        test: cssModulesPattern,
        exclude: excludedPatterns,
        use: extractCssModules.extract({
          fallback: 'style-loader',
          use: CssModuleLoaders,
        }),
      },

      // Global CSS
      {
        test: /\.s?css$/,
        exclude: [...excludedPatterns, cssModulesPattern],
        use: extractGlobalCss.extract({
          fallback: 'style-loader',
          use: globalCssLoaders,
        }),
      },

      // ESLint
      ifLint(
        ifProd({
          test: /\.jsx?$/,
          exclude: excludedPatterns,
          enforce: 'pre',
          use: [
            {
              loader: 'eslint-loader',
              query: {
                failOnError: env.isProd,
                failOnWarning: env.isProd,
                fix: env.isProd,
              },
            },
          ],
        }),
      ),

      // Babel
      {
        test: /\.jsx?$/,
        exclude: excludedPatterns,
        use: compact([ifReact(ifHot('react-hot-loader/webpack')), babelLoader]),
      },

      // TSLint
      ifLint(
        ifProd({
          test: /\.tsx?$/,
          exclude: excludedPatterns,
          enforce: 'pre',
          use: [
            {
              loader: 'tslint-loader',
              options: {
                emitErrors: env.isProd,
                failOnHint: env.isProd,
                typeCheck: false,
                fix: false,
              },
            },
          ],
        }),
      ),

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
                module: 'esnext',
                target: 'esnext',
                jsx: 'preserve',
                noEmitOnError: env.shouldTypeCheck,
              },
            },
          },
        ]),
      },

      // Code Coverage
      ifTest({
        enforce: 'post',
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: excludedPatterns,
        use: [
          {
            loader: 'istanbul-instrumenter-loader',
            query: {
              esModules: true,
            },
          },
        ],
      }),

      // SVG Icons
      {
        test: /\.svg$/,
        exclude: excludedPatterns,
        include: [path.resolve(__dirname, 'src/icons')],
        use: createSvgIconLoaders('icons.svg'),
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
    new webpack.DefinePlugin({
      __DEBUG__: JSON.stringify(env.isDev),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      isHot: JSON.stringify(env.isHot),
    }),

    // HTML index
    new WebpackHTMLPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
      inject: 'body',
      minify: env.isProd
        ? {
            html5: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
          }
        : false,
    }),

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

    // Required for debugging in development and for long-term caching in production
    new webpack.NamedModulesPlugin(),

    // Production-only
    ...ifProd([
      // Chunks

      // See https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
      new webpack.NamedChunksPlugin(),
      new NameAllModulesPlugin(),

      // The order of the following instances is important
      // This chunk contains all vendor code, except React and related libraries
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module) {
          return (
            module.context && module.context.indexOf('node_modules') !== -1
          );
        },
      }),

      // This chunk contains React/Preact and all related libraries
      new webpack.optimize.CommonsChunkPlugin({
        name: 'react',
        minChunks(module) {
          if (module.context !== undefined) {
            const relative = path.relative('./node_modules', module.context);

            return (
              module.context.indexOf('node_modules') !== -1 &&
              relative.match(/^p?react/i)
            );
          }

          return false;
        },
      }),

      new webpack.optimize.CommonsChunkPlugin({
        async: true,
        minChunks: Infinity,
      }),

      // Make a separate manifest chunk for better long-term caching
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity,
      }),

      // Merge modules duplicated across multiple chunks
      new webpack.optimize.AggressiveMergingPlugin({
        moveToParents: true,
      }),

      new webpack.optimize.OccurrenceOrderPlugin(true),

      // Scope hoisting a la Rollup (Webpack 3+)
      // new webpack.optimize.ModuleConcatenationPlugin(),

      // Minification
      ...ifEs5([
        new webpack.optimize.UglifyJsPlugin({
          minimize: true,
          comments: false,
          sourceMap: true,
        }),
      ]),

      ...ifEsNext([new BabiliPlugin()]),

      // Banner
      new webpack.BannerPlugin({
        entryOnly: true,
        banner: `${pkg.displayName ||
          pkg.name} hash:[hash], chunkhash:[chunkhash], name:[name]`,
      }),
    ]),
  ]),
};

module.exports = config;
