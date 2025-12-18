// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import importQuotes from 'eslint-plugin-import-quotes';
import unicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['*.js'], // ✅ Only for JS files
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // ✅ Allow require() in JS files
    },
  },
  {
    plugins: {
      'unused-imports': unusedImports, // ✅ Added from first config
      'import-quotes': importQuotes, // ✅ Added from first config
      unicorn: unicorn,
    },
    rules: {
      // ✅ Added rules from first config
      quotes: ['error', 'single'],
      'import-quotes/import-quotes': ['error', 'single'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'always-multiline',
        },
      ],
      'prefer-const': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
        },
      ],
    },
  },
  {
    ignores: ['dist/**', 'build/**'],
  },
);
