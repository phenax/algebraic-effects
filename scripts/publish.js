const fsextra = require('fs-extra');
const path = require('path');
const { map, filter, compose } = require('ramda');
const rootProjectPackageJson = require('../package.json');

const { getPackages, PACKAGE_ROOT, PROJECT_ROOT, toPackagePaths, getPackageJson, resolveAll, errorHandler, ask, runCommand } = require('./utils');

const isLoggedIn = !process.argv.includes('--login');
const forwardArgs = process.argv.slice(2).filter(a => !['--login'].includes(a));

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

const askNextVersion = version => ask(`Next version [current: ${version}] -> `);

const loginUser = () => 
  runCommand('npm', ['login', '--scope', rootProjectPackageJson.scope], { cwd: PROJECT_ROOT });

const publishPackage = dir =>
  runCommand('npm', ['publish', '--access=public', ...forwardArgs], { cwd: dir });

const savePackageJson = (pjson, dir) =>
  fsextra.writeFile(path.join(dir, 'package.json'), JSON.stringify(pjson, 0, 2));

const updatePackageDepVersion = (type, packages, version) => _pJson => {
  const pJson = {..._pJson};
  if (pJson[type]) {
    Object.keys(pJson[type])
      .filter(dep => packages.find(([{ name }]) => name === dep))
      .forEach(dep => (pJson[type][dep] = version));
  }
  return pJson;
};

const updatePackageVersion = (version, packages) => {
  if (!version) return Promise.resolve();
  if (!isVersionValid(version)) return Promise.reject(new Error(`Invalid version ${version}`));

  return Promise.resolve(packages.map(dir => [fetchPackageJson(dir), dir]))
    .then(pJsons => [ ...pJsons, [rootProjectPackageJson, PROJECT_ROOT] ])
    .then(packages => packages.map(([ _pJson, dir ]) => {
      const pJson = compose(
        updatePackageDepVersion('peerDependencies', packages, version),
        updatePackageDepVersion('optionalDependencies', packages, version),
        updatePackageDepVersion('devDependencies', packages, version),
        updatePackageDepVersion('dependencies', packages, version),
      )({ ..._pJson, version });
      return [ pJson, dir ];
    }))
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
