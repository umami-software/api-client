module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.(css|less|jpg|png|svg)$': '<rootDir>/test/mocks/emptyModule.js',
    '^(components|assets|hooks|styles)(.*)': '<rootDir>/src/$1/$2',
    '^(icons)': '<rootDir>/src/$1',
  },
};
