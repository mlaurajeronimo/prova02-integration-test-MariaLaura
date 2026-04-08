module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.[jt]s?(x)'],
  verbose: true,
  testTimeout: 30000,
  collectCoverage: true,
  coverageReporters: ['lcov'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './output',
        filename: 'report.html',
        pageTitle: 'Integration Tests with Jest and Pactum',
        logoImgPath: './assets/jest-logo.png',
        expand: false,
        openReport: false
      }
    ],
    [
      'jest-junit',
      {
        outputDirectory: './output',
        outputName: 'junit.xml'
      }
    ]
  ]
};
