const path = require('path');
const { map, filter, head, compose } = require('ramda');

const webpack = require('webpack');

const { getPackageJson, toPackagePaths, resolveAll, getPackages, errorHandler } = require('./utils');

process.env.NODE_ENV = 'development';

const [actionName] = process.argv.slice(2);

const toWpConfig = ([ dir, pjson ]) => makeConfig({
  entry: path.join(dir, 'index.js'),
  output: {
    path: path.join(dir, 'public/assets'),
    filename: 'bundle.js',
    publicPath: pjson.homepage || '/',
  },
});

const onBuildComplete = (err, stats) => {
  if(err) throw err;
  console.log(stats.toString({ colors: true }));
};

const actions = {
  build: compose(
    compiler => compiler.run(onBuildComplete),
    webpack,
    toWpConfig,
  ),
  watch: compose(
    compiler => compiler.watch(watchOptions, onBuildComplete),
    webpack,
    toWpConfig,
  ),
  publish: ([ dir ]) => {
    console.log('Publishing', dir);
  },
};

if (!actionName || !actions[actionName]) {
  throw new Error('You need to specify the action (build, watch, publish)');
}

const isDoc = dir => {
  try {
    return getPackageJson(dir).isDoc || false;
  } catch(e) {
    return false;
  }
};

const babelOptions = {
  presets: ['@babel/preset-env', 'babel-preset-react-app']
};
const watchOptions = {
  aggregateTimeout: 300,
  poll: 500,
  ignored: /node_modules/,
};

const makeConfig = ({ ...extend }) => ({
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: babelOptions,
        }
      },
      {
        test: /.mdx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
          {
            loader: '@mdx-js/loader',
            options: {
              mdPlugins: [
                require('remark-emoji'),
                require('remark-highlight.js'),
                require('remark-slug'),
              ]
            }
          }
        ]
      },
    ],
  },
  ...extend,
});


const getDocDirectories = () =>
  getPackages()
    .then(toPackagePaths)
    .then(filter(isDoc))
    .then(resolveAll);


const action = actions[actionName];

getDocDirectories()
  .then(map(dir => [dir, getPackageJson(dir)]))
  .then(head)
  .then(action)
  .catch(errorHandler);

