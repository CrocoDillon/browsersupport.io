import { fileURLToPath } from 'node:url'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  prettier,
  {
    settings: {
      react: { version: '19.3' },
      next: {
        rootDir: [
          fileURLToPath(new URL('./apps/web/', import.meta.url)),
          fileURLToPath(new URL('./apps/lab/', import.meta.url)),
        ],
      },
    },
  },
  globalIgnores([
    '**/.next/**',
    '**/.vercel/**',
    '**/.turbo/**',
    '.qa/**',
    '.agents/**',
    '**/next-env.d.ts',
    'coverage/**',
  ]),
])
