const path = require('path');
const fsextra = require('fs-extra');
const { map, filter, head, compose } = require('ramda');

const webpack = require('webpack');

const { getPackageJson, toPackagePaths, resolveAll, getPackages, errorHandler, runCommand } = require('./utils');

const [actionName] = process.argv.slice(2);


process.env.NODE_ENV = actionName === 'build' ? 'production' : 'development';

const isDoc = dir => {
  try {
    return getPackageJson(dir).isDoc || false;
  } catch(e) {
    return false;
  }
};

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env', 'babel-preset-react-app']
  },
};

const makeConfig = extend => ({
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.js','.ts','.tsx','.mdx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [ babelLoader, 'ts-loader' ],
        exclude: /node_modules/
      },
      {
        test: /.js$/,
        exclude: /(node_modules)/,
        use: babelLoader,
      },
      {
        test: /.mdx?$/,
        use: [
          babelLoader,
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

const toWpConfig = ([ dir, pjson ]) => makeConfig({
  entry: path.join(dir, 'index.js'),
  output: {
    path: path.join(dir, 'public/assets'),
    filename: 'bundle.js',
    chunkFilename: '[name].[hash:4].js',
    publicPath: path.join(pjson.homepage || '/', 'assets/'),
  },
});

const onBuildComplete = (err, stats) => {
  if(err) throw err;
  console.log(stats.toString({ colors: true }));
};

const publishToGhPages = dir =>
  runCommand('git', `subtree push --prefix ${dir} origin gh-pages`.split(' '), { cwd: path.resolve('.') });

const getCompiler = ([ dir, pjson ]) => [dir, webpack( toWpConfig([ dir, pjson ]) )];

const startBuilder = fn => ([ dir, compiler ]) => {
  const removeAssets = () => fsextra.remove(path.join(dir, 'public/assets'));
  compiler.hooks.beforeRun.tapPromise('runnerHook.remove', removeAssets);
  compiler.hooks.watchRun.tapPromise('watcherHook.remove', removeAssets);
  return fn([ dir, compiler ]);
};

const actions = {
  build: compose(
    startBuilder(([ _, compiler ]) => compiler.run(onBuildComplete)),
    getCompiler,
  ),
  watch: compose(
    startBuilder(([ _, compiler ]) => compiler.watch(
      { aggregateTimeout: 300, poll: 500, ignored: /node_modules/ },
      onBuildComplete,
    )),
    getCompiler,
  ),
  publish: ([ dir ]) => {
    const relativePath = path.join(dir, 'public').replace(path.resolve('.') + '/', '');
    return publishToGhPages(relativePath);
  },
};


if (!actionName || !actions[actionName]) {
  throw new Error('You need to specify the action (build, watch, publish)');
}

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

