const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const { map } = require('ramda');

const PROJECT_ROOT = path.join(__dirname, '..');
const PACKAGE_ROOT = path.join(PROJECT_ROOT, 'packages/');


const getPackageJson = dir => JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));

const toPackagePaths = map(p => path.join(PACKAGE_ROOT, p));

const fromNodeCalllback = fn => (...args) => new Promise(
  (resolve, reject) => fn(...args, (err, data) => err ? reject(err) : resolve(data))
);
const resolveAll = ps => Promise.all(ps);


const globber = fromNodeCalllback(glob);
const getPackages = () => fromNodeCalllback(fs.readdir)(PACKAGE_ROOT);

const errorHandler = e => {
  console.log();
  console.log(chalk.red.bold(`Command failed: ${e.message}`));
  console.error(e);
  console.log();
};

module.exports = {
  getPackageJson,
  PACKAGE_ROOT,
  toPackagePaths,
  fromNodeCalllback,
  resolveAll,
  globber,
  getPackages,
  errorHandler,
};
