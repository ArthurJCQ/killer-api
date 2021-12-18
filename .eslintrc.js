const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'prettier', // -> [eslint-config-prettier]
    'eslint:recommended', // -> [eslint]
    'plugin:json/recommended', // -> [eslint-plugin-json]
    'plugin:@typescript-eslint/recommended', // [typescript eslint rules..]
    'plugin:prettier/recommended', // [typescript eslint rules..]
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': ['error', prettierOptions], // Enhance prettier with custom options
    '@typescript-eslint/explicit-function-return-type': ['error'], // Explicit types for function return
    '@typescript-eslint/no-empty-function': 'off', // Disable this rule to make empty function for testing case or default props
    '@typescript-eslint/no-var-requires': 'off', // Disable this rule to enable ES5 imports (const something = require('something');)
    '@typescript-eslint/no-use-before-define': ['error', { typedefs: false }],
    'import/order': [
      2,
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order:
            'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },
      },
    ],
  },
};
