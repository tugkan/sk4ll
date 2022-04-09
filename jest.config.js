module.exports = {
    cacheDirectory: 'jest-cache',
    collectCoverage: true,
    clearMocks: true,
    collectCoverageFrom: [
        './**/*.js',
    ],
    coverageDirectory: 'jest-coverage',
    coverageProvider: 'babel',
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    roots: ['./'],
    verbose: true,
    silent: false,
    moduleNameMapper: {
        '^@helpers(.*)$': '<rootDir>src/helpers$1',
        '^@scanners(.*)$': '<rootDir>src/scanners$1',
    },
};
