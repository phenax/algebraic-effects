
module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  transform: {
    '.*': 'babel-jest',
  },
  testRegex: 'packages/.*\\.(spec|test)\\.(j|t)sx?$',
  moduleFileExtensions: ['js', 'json', 'node', 'coffee', 'ts'],
  rootDir: process.cwd(),
  roots: ['<rootDir>/packages'],
  collectCoverageFrom: ['packages/**/src/**/*.js'],
  setupFiles: [
    '<rootDir>/scripts/testSetup.js',
  ],
};
