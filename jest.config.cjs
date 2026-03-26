const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/__tests__/**/*.test.cjs',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/lib/auth-client(.*)$': '<rootDir>/src/test-utils/auth-client.mock.ts',
    '^/src/lib/auth-client(.*)$': '<rootDir>/src/test-utils/auth-client.mock.ts',
    '^better-auth/react$': '<rootDir>/src/test-utils/better-auth-react.mock.ts',
    '^better-auth(.*)$': '<rootDir>/src/test-utils/auth-client.mock.ts',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/domains/(.*)$': '<rootDir>/src/domains/$1',
    '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@/lib/(?!auth-client)(.*)$': '<rootDir>/src/lib/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/shared/(.*)$': '<rootDir>/src/ui/shared/$1',
    '^@/hooks$': '<rootDir>/src/hooks',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/providers$': '<rootDir>/src/providers/index.js',
    '^@/providers/(.*)$': '<rootDir>/src/providers/$1',
    '^@/atoms$': '<rootDir>/src/ui/atoms',
    '^@/atoms/(.*)$': '<rootDir>/src/ui/atoms/$1',
    '^@/buttons$': '<rootDir>/src/ui/atoms/buttons',
    '^@/buttons/(.*)$': '<rootDir>/src/ui/atoms/buttons/$1',
    '^@/icons$': '<rootDir>/src/ui/atoms/icons',
    '^@/icons/(.*)$': '<rootDir>/src/ui/atoms/icons/$1',
    '^@/links$': '<rootDir>/src/ui/atoms/links',
    '^@/links/(.*)$': '<rootDir>/src/ui/atoms/links/$1',
    '^@/texts$': '<rootDir>/src/ui/atoms/texts',
    '^@/texts/(.*)$': '<rootDir>/src/ui/atoms/texts/$1',
    '^@/molecules$': '<rootDir>/src/ui/molecules',
    '^@/molecules/(.*)$': '<rootDir>/src/ui/molecules/$1',
    '^@/organisms$': '<rootDir>/src/ui/organisms',
    '^@/organisms/(.*)$': '<rootDir>/src/ui/organisms/$1',
    '^@/overlays$': '<rootDir>/src/ui/overlays',
    '^@/overlays/(.*)$': '<rootDir>/src/ui/overlays/$1',
    '^@/state/(.*)$': '<rootDir>/src/state/$1',
    '^@/conf/(.*)$': '<rootDir>/src/config/$1',
    '^@/images/(.*)$': '<rootDir>/public/images/$1',
    '^@/test-utils/(.*)$': '<rootDir>/src/test-utils/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
