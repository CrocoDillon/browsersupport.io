import type { Config } from 'jest'
import nextJest from 'next/jest.js'
const createJestConfig = nextJest({ dir: './' })
const config: Config = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '^@browsersupport/data$': '<rootDir>/../../packages/data/src/index.ts',
    '^@browsersupport/data/detection$':
      '<rootDir>/../../packages/data/src/detection.ts',
    '^@browsersupport/data/validation$':
      '<rootDir>/../../packages/data/src/validation.ts',
    '^@browsersupport/data/database$':
      '<rootDir>/../../packages/data/src/database.ts',
  },
}
export default createJestConfig(config)
