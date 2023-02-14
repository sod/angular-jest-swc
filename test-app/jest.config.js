const {transform} = require("./test/jest/jest-swc-node");

module.exports = {
  transform: transform('2018'),
  testEnvironment: require.resolve('jest-environment-jsdom'),
  moduleFileExtensions: ['ts', 'js', 'json'],
  transformIgnorePatterns: ['node_modules/(?!@angular|@ngrx|@ngx-translate)', 'dist/.+\\.js$'],
  coverageReporters: ['lcov', 'html'],
  coveragePathIgnorePatterns: ['<rootDir>/test/', '<rootDir>/node_modules/'],
  collectCoverageFrom: ['src/**/*.ts'],
  moduleNameMapper: {
    '^test/(.*)': '<rootDir>/test/$1',
    '^src/(.*)': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['./test/jest/test-main.ts'],
  testMatch: ['**/*.spec.ts'],
};
