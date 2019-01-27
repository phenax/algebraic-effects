const fsextra = require('fs-extra');
const watch = require('node-watch');
const path = require('path');
const { map, filter, flatten, compose, uniq, prop } = require('ramda');

const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const { getPackageJson, toPackagePaths, globber, resolveAll, getPackages, errorHandler } = require('./utils');

process.env.NODE_ENV = 'development';

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

getDocDirectories()
  .then(map(dir => [dir, getPackageJson(dir)]))
  .then(map(([ dir, pjson ]) => makeConfig({
    entry: path.join(dir, 'index.js'),
    output: {
      path: path.join(dir, 'public/assets'),
      filename: 'bundle.js',
      publicPath: pjson.homepage || '/',
    },
  })))
  .then(webpack)
  .then(compiler => compiler.watch(watchOptions, (err, stats) => {
    if(err) throw err;
    console.log(stats.toString({ colors: true }));
  }))
  .catch(console.error);

