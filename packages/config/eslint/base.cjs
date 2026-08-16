const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'Task-1 packages must not make network requests.' },
      ],
    },
  },
];
