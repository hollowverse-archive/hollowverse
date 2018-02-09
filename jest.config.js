module.exports = {
  globals: {
    'ts-jest': {
      skipBabel: false,
      // enableTsDiagnostics: true,
    },
  },
  transform: {
    '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['__snapshots__'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleDirectories: [
    'src/app',
    'src',
    '.',
    'node_modules',
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/mocks/svgModule.ts',
    '\\.(graphql|gql)$': '<rootDir>/mocks/graphqlQuery.ts',
    '^(\\!{1,2}/)?file-loader\\!.+': '<rootDir>/mocks/url.ts',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
