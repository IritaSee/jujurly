// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import reactDom from 'eslint-plugin-react-dom';
import reactX from 'eslint-plugin-react-x';

export default tseslint.config(
  {
    ignores: ['dist', 'build'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-dom': reactDom,
      'react-x': reactX,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...reactX.configs['recommended-typescript'].rules ? [] : [], // optional workaround for some setups
      ...reactDom.configs.recommended.rules ? [] : [],
    ],
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactX.configs['recommended-typescript']?.rules,
      ...reactDom.configs.recommended?.rules,

      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/jsx-uses-react': 'off', // not needed with React 17+
      'react/react-in-jsx-scope': 'off', // not needed with React 17+

      // Custom additions
      'no-console': 'warn',
      'no-debugger': 'warn',
      'react/prop-types': 'off', // Using TS for props
    },
  }
);
