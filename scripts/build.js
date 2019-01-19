const fs = require('fs');
const fsextra = require('fs-extra');
const path = require('path');
const glob = require('glob');
const babel = require('@babel/core');
const { map, filter, flatten, compose, uniq, prop } = require('ramda');

const babelConfig = require('../babel.config');

const PCKGS_ROOT = path.join(__dirname, '../packages/');

const fromNodeCalllback = fn => (...args) => new Promise(
  (resolve, reject) => fn(...args, (err, data) => err ? reject(err) : resolve(data))
);
const resolveAll = ps => Promise.all(ps);

const globber = fromNodeCalllback(glob);
const getPackages = () => fromNodeCalllback(fs.readdir)(PCKGS_ROOT);

const toPackagePaths = map(p => path.join(PCKGS_ROOT, p));
const toSrcPath = p => path.join(p, 'src');
const toBuildPath = (p, ...files) => path.join(p, 'build', ...files);

const isBuildable = dir => {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).isBuildTarget || false;
  } catch(e) {
    return false;
  }
};

const saveCodeFile = ({ buildPath, code }) => fsextra.outputFile(buildPath, code);
const compileFile = file => babel.transformFileAsync(file);
const compileDirectory = dir => globber(`${dir}/**/*.js`).then(map(compileFile)).then(resolveAll);
const compileSourceFiles = dir => {
  const srcPath = toSrcPath(dir);
  return compileDirectory(srcPath).then(map(file => ({
    ...file,
    buildPath: toBuildPath(dir, `${file.options.filename}`.replace(srcPath, '')),
    packageDir: dir,
  })));
};


babel.loadOptions(babelConfig);

getPackages()
  .then(toPackagePaths)
  .then(filter(isBuildable))
  .then(resolveAll)
  .then(map(compileSourceFiles))
  .then(resolveAll)
  .then(flatten)
  .then(files =>
    compose(
      r => r.then(() => files),
      resolveAll,
      map(compose(
        fsextra.remove,
        toBuildPath,
      )),
      uniq,
      map(prop('packageDir')),
    )(files),
  )
  .then(map(saveCodeFile))
  .then(resolveAll)
  .then(files => {
    console.log('Built', files.length, 'files successfully');
  })
  .catch(e => {
    console.error(e);
  });
