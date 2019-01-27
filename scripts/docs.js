const path = require('path');
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
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /(node_modules|bower_components)/,
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
    publicPath: pjson.homepage || '/',
  },
});

const onBuildComplete = (err, stats) => {
  if(err) throw err;
  console.log(stats.toString({ colors: true }));
};

const publishToGhPages = dir =>
  runCommand('git', `subtree push --prefix ${dir} origin gh-pages`.split(' '), { cwd: path.resolve('.') });

const actions = {
  build: compose(
    compiler => compiler.run(onBuildComplete),
    webpack,
    toWpConfig,
  ),
  watch: compose(
    compiler => compiler.watch({ aggregateTimeout: 300, poll: 500, ignored: /node_modules/ }, onBuildComplete),
    webpack,
    toWpConfig,
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

