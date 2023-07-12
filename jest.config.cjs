module.exports = {
  verbose: true,
  rootDir: './src',
  coverageDirectory: '../coverage/',
  testPathIgnorePatterns: ['./node_modules/', '.*fixture.js'],
  coveragePathIgnorePatterns: ['./node_modules/', '.*fixture.js'],
  resetMocks: false,
  setupFiles: ['jest-localstorage-mock'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
}
