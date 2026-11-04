import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import jsxA11y from 'eslint-plugin-jsx-a11y'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // project rules
  {
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      'no-console': 'error',
      'import/no-default-export': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/no-danger': 'error',
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message: 'Read configuration from env (@/env).',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next/link',
              message: 'Use Link from @/i18n/navigation.',
            },
            {
              name: 'next/navigation',
              importNames: [
                'redirect',
                'permanentRedirect',
                'useRouter',
                'usePathname',
              ],
              message:
                'Use @/i18n/navigation. Only notFound comes from next/navigation.',
            },
          ],
        },
      ],
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './components',
              from: './app',
              message: 'components never import from app.',
            },
            {
              target: './hooks',
              from: './app',
              message: 'hooks never import from app.',
            },
            {
              target: './lib',
              from: ['./app', './components', './hooks'],
              message: 'lib never imports from app, components or hooks.',
            },
          ],
        },
      ],
    },
  },

  // typescript rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Use an as const array and a union type instead of enum.',
        },
      ],
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/db', '@/db/*'],
              message:
                'Only lib/server, db, lib/auth.ts and tests import the database.',
            },
          ],
        },
      ],
    },
  },

  // files that Next.js or a tool needs as default exports
  {
    files: [
      'app/**/{page,layout,loading,error,not-found,global-error,template,default}.tsx',
      'proxy.ts',
      'i18n/request.ts',
      '*.config.{ts,mjs,js}',
    ],
    rules: { 'import/no-default-export': 'off' },
  },

  // data access layer and tests may import the database
  {
    files: ['lib/server/**', 'db/**', 'lib/auth.ts', 'tests/**'],
    rules: { '@typescript-eslint/no-restricted-imports': 'off' },
  },

  // only env.ts and config files read process.env
  {
    files: ['env.ts', '*.config.{ts,mjs,js}'],
    rules: { 'no-restricted-properties': 'off' },
  },

  // one file allowed to call console
  {
    files: ['lib/log.ts'],
    rules: { 'no-console': 'off' },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
