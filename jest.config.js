module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  reporters: ['default', 'jest-junit'],
  forceExit: true,
  testMatch: ['**/test/**/!(lib)/*.[jt]s?(x)'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/lib/config.*', // not wasting time on a simple class with a 'get' and 'has' function
    'src/lib/logger*', // also not worth testing now
    'src/lib/fail-action*', // only matters for dev mode
    'src/test/integration/lib/',
    'src/plugins/logging*', // don't need to test an already tested module
  ],
};
