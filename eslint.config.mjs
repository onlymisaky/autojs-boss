import antfu from '@antfu/eslint-config';

/** @link https://github.com/antfu/eslint-config */
/** @type {import('eslint').Linter.Config[]} */
export default antfu({
  rules: {
    'style/arrow-parens': 'off',
    'style/semi': ['error', 'always'],
    'style/quote-props': 'off',
    'node/prefer-global/process': 'off',
    'no-console': 'off',
  },
  languageOptions: {
    globals: {
      auto: 'readonly',
      app: 'readonly',
      home: 'readonly',
      back: 'readonly',
      currentPackage: 'readonly',
      currentActivity: 'readonly',
      threads: 'readonly',
      selector: 'readonly',
      sleep: 'readonly',
      waitForActivity: 'readonly',
      swipe: 'readonly',
      device: 'readonly',
      events: 'readonly',
      getClip: 'readonly',
    },
  },
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  ignores: [
    '**/jsconfig.json',
    'types/**/*.d.ts',
  ],
});
