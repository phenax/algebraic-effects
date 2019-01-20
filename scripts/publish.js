const fsextra = require('fs-extra');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const { spawn } = require('child_process');
const { map, filter } = require('ramda');
const rootProjectPackageJson = require('../package.json');

const { getPackages, PACKAGE_ROOT, PROJECT_ROOT, toPackagePaths, getPackageJson, resolveAll, errorHandler } = require('./utils');

const isLoggedIn = !process.argv.includes('--login');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const packageJsonCache = {};

const fetchPackageJson = dir => {
  if(packageJsonCache[dir])
    return packageJsonCache[dir];

  try {
    const packageJson = getPackageJson(dir);
    packageJsonCache[dir] = packageJson;
    return packageJson;
  } catch(e) {
    return null;
  }
};

const isPublishable = dir => {
  const packageJson = fetchPackageJson(dir);
  return packageJson ? !packageJson.private : false;
};

const isVersionValid = ver => ver.split('-')[0].split('.').filter(x => /\d+/gi.test(x)).length === 3;

const askNextVersion = version => new Promise(resolve => rl.question(`Next version [current: ${version}] -> `, result => {
  resolve(result);
  rl.close();
}));

const runCommand = (command, args = [], optns = {}) => new Promise((resolve, reject) => {
  console.log(chalk.gray(`>> Running ${command} ${args.join(' ')}`));
  const p = spawn(command, args, { detached: false, stdio: 'inherit', ...optns });
  p.on('error', reject);
  p.on('close', resolve);
  p.on('exit', resolve);
});

const loginUser = () => 
  runCommand('npm', ['login', '--scope', rootProjectPackageJson.scope], { cwd: PROJECT_ROOT });

const publishPackage = dir => runCommand('npm', ['publish', '--access=public'], { cwd: dir });

const savePackageJson = (pjson, dir) => fsextra.writeFile(path.join(dir, 'package.json'), JSON.stringify(pjson, 0, 2));

const updatePackageVersion = (version, packages) => {
  if (!version) return Promise.resolve();
  if (!isVersionValid(version))
    return Promise.reject(new Error(`Invalid version ${version}`));

  return Promise.resolve(packages.map(dir => [fetchPackageJson(dir), dir]))
    .then(pJsons => [ ...pJsons, [rootProjectPackageJson, PROJECT_ROOT] ])
    .then(map(([ pJson, dir ]) => [ { ...pJson, version }, dir ]))
    .then(map(([pJson, dir]) => savePackageJson(pJson, dir)))
    .then(resolveAll);
};

getPackages()
  .then(toPackagePaths)
  .then(filter(isPublishable))
  .then(dirList => dirList.length ? dirList : Promise.reject(new Error('No publishable project found')))
  .then(dirList =>
    askNextVersion(rootProjectPackageJson.version)
      .then(v => updatePackageVersion(v, dirList))
      .then(() => dirList)
  )
  .then(map(dir =>
    (isLoggedIn ? Promise.resolve() : loginUser())
      .then(() => console.log(`Publishing ${dir.replace(PACKAGE_ROOT, '')}...`))
      .then(() => publishPackage(dir))
      .then(() => dir))
  )
  .then(resolveAll)
  .catch(errorHandler);
