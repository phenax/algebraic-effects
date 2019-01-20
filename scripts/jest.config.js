
module.exports = {
  transform: {
    '.*': 'babel-jest',
  },
  testRegex: 'packages/.*\\.test\\.js$',
  moduleFileExtensions: ['js', 'json', 'node', 'coffee', 'ts'],
  rootDir: process.cwd(),
  roots: ['<rootDir>/packages'],
  collectCoverageFrom: ['packages/**/src/**/*.js'],
};
