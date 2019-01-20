const fsextra = require('fs-extra');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');
const { map, filter, compose } = require('ramda');
const rootProjectPackageJson = require('../package.json');

const { getPackages, PACKAGE_ROOT, toPackagePaths, getPackageJson, resolveAll } = require('./utils');

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

const publishPackage = dir => {
  const p = exec('pwd', { cwd: dir }); // TODO: replace with actual publish script
  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);
  return dir;
};

const savePackageJson = (pjson, dir) => fsextra.writeFile(path.join(dir, 'package.json'), JSON.stringify(pjson, 0, 2));

const updatePackageVersion = (version, packages) => {
  if (!version) return Promise.resolve();
  if (!isVersionValid(version))
    return Promise.reject(new Error(`Invalid version ${version}`));

  return Promise.resolve(packages.map(dir => [fetchPackageJson(dir), dir]))
    .then(pJsons => [ ...pJsons, [rootProjectPackageJson, path.join(__dirname, '..')] ])
    .then(map(([ pJson, dir ]) => [ { ...pJson, version }, dir ]))
    .then(map(([pJson, dir]) => savePackageJson(pJson, dir)))
    .then(resolveAll);
};

getPackages()
  .then(toPackagePaths)
  .then(filter(isPublishable))
  .then(dirList =>
    askNextVersion(rootProjectPackageJson.version)
      .then(v => updatePackageVersion(v, dirList))
      .then(() => dirList)
  )
  .then(map(dir => {
    console.log(`Publishing ${dir.replace(PACKAGE_ROOT, '')}...`);
    publishPackage(dir);
  }))
  .catch(console.error);
