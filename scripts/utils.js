const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { map, filter, flatten, compose, uniq, prop } = require('ramda');

const PACKAGE_ROOT = path.join(__dirname, '../packages/');

const getPackageJson = dir => JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));

const toPackagePaths = map(p => path.join(PACKAGE_ROOT, p));

const fromNodeCalllback = fn => (...args) => new Promise(
  (resolve, reject) => fn(...args, (err, data) => err ? reject(err) : resolve(data))
);
const resolveAll = ps => Promise.all(ps);


const globber = fromNodeCalllback(glob);
const getPackages = () => fromNodeCalllback(fs.readdir)(PACKAGE_ROOT);

module.exports = {
  getPackageJson,
  PACKAGE_ROOT,
  toPackagePaths,
  fromNodeCalllback,
  resolveAll,
  globber,
  getPackages,
};
