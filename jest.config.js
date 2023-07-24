export default {
  verbose: true,
  rootDir: './src',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}'],
  coverageDirectory: '../coverage/',
  testPathIgnorePatterns: ['./node_modules/', '.*fixture.js'],
  coveragePathIgnorePatterns: ['./node_modules/', '.*fixture.js'],
  resetMocks: false,
  setupFiles: ['jest-localstorage-mock', 'jest-environment-jsdom'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
}
