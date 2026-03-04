module.exports = {
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
  },
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts'],
}
