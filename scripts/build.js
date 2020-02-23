const fsextra = require('fs-extra');
const watch = require('node-watch');
const path = require('path');
const babel = require('@babel/core');
const { execSync } = require('child_process');
const { map, filter, flatten, compose, uniq, prop, tap } = require('ramda');

const { getPackageJson, toPackagePaths, globber, resolveAll, getPackages, errorHandler } = require('./utils');

const babelConfig = require('../babel.config');

const WATCHER_OPTNS = { recursive: true, filter: /\/src\/.*\.(js|ts)x?$/, delay: 100 };

const isWatchEnabled = process.argv.includes('--watch');

process.env.NODE_ENV = isWatchEnabled ? 'development' : 'production';

const toSrcPath = p => path.join(p, 'src');
const toBuildPath = (p, ...files) => path.join(p, 'build', ...files);

const isBuildable = dir => {
  try {
    return !!getPackageJson(dir).buildOptions || false;
  } catch(e) {
    return false;
  }
};

const saveCodeFile = ({ buildPath, code }) => fsextra.outputFile(buildPath, code);
const compileFile = file => babel.transformFileAsync(file, { comments: false });
const compileDirectory = dir => globber(`${dir}/**/*.[tj]s`).then(map(compileFile)).then(resolveAll);
const compileSourceFiles = async dir => {
  const srcPath = toSrcPath(dir);
  const toOutputInfo = map(file => ({
    ...file,
    buildPath: toBuildPath(dir, `${file.options.filename}`.replace(srcPath, '').replace(/\.ts$/, '.js')),
    packageDir: dir,
  }));

  // Type declarations generation
  console.log('');
  try {
    const relativePath = dir.replace(path.resolve(), '').replace(/^\/+/, '');
    execSync(`npx tsc --emitDeclarationOnly ${relativePath}/**/*.ts --declaration --outDir ${dir}`);
  } catch(e) {
    // console.log(e.message);
    console.warn('TYPINGS WARNING ::', e.output.toString());
  }

  const result = await compileDirectory(srcPath);
  return toOutputInfo(result);
};

const getBuildablePackages = () =>
  getPackages()
    .then(toPackagePaths)
    .then(filter(isBuildable))
    .then(resolveAll);

const build = packages =>
  Promise.resolve(packages)
    .then(map(compileSourceFiles))
    .then(resolveAll)
    .then(flatten)
    .then(files =>
      compose(
        r => r.then(() => files),
        resolveAll,
        map(compose(fsextra.remove, toBuildPath)),
        uniq,
        map(prop('packageDir')),
      )(files),
    )
    .then(map(saveCodeFile))
    .then(resolveAll)
    .catch(e => {
      errorHandler(e);
      return Promise.reject(e);
    });

babel.loadOptions(babelConfig);

const packageDirectoryList = getBuildablePackages();

process.stdout.write('Compiling...');

packageDirectoryList
  .then(build)
  .then(files => {
    process.stdout.write(`\rBuilt ${files.length} files successfully\n`);
    return packageDirectoryList;
  })
  .then(packages => {
    if (!isWatchEnabled) return;

    console.log('Watching files for changes...\n');

    const watcher = watch(packages, WATCHER_OPTNS, () => {
      process.stdout.write('\rRecompiling...');
      build(packages).then(() => {
        process.stdout.write('\rDone          ');
      });
    });

    const cleanup = () => {
      watcher.close();
    };

    process.on('SIGINT', cleanup);
    process.on('exit', () => {
      console.log('\nBye!');
      cleanup();
    });
  });
