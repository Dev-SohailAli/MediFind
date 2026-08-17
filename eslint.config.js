const baseConfig = require('./packages/config/eslint/base.cjs');

module.exports = [
  {
    ignores: ['**/node_modules/**', '**/dist/**', 'pnpm-lock.yaml', '**/coverage/**'],
  },
  ...baseConfig,
  {
    files: ['**/*.cjs', 'eslint.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'writable',
        require: 'readonly',
        exports: 'writable',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@medifind/worker', '**/apps/worker/**'],
              message: 'apps/web must not import from the server-only Worker package.',
            },
          ],
        },
      ],
    },
  },
];
