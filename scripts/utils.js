const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const readline = require('readline');
const { spawn } = require('child_process');
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

const ask = question => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, result => {
    resolve(result);
    rl.close();
  }));
};

const runCommand = (command, args = [], optns = {}) => new Promise((resolve, reject) => {
  console.log(chalk.gray(`>> Running ${command} ${args.join(' ')}`));
  const p = spawn(command, args, { detached: false, stdio: 'inherit', ...optns });
  p.on('error', reject);
  p.on('close', resolve);
  p.on('exit', resolve);
});

module.exports = {
  getPackageJson,
  PACKAGE_ROOT,
  toPackagePaths,
  fromNodeCalllback,
  resolveAll,
  globber,
  getPackages,
  errorHandler,
  ask,
  runCommand,
};
