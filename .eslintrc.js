module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended', 'plugin:prettier/recommended', 'plugin:vue/vue3-strongly-recommended', 'plugin:vue/strongly-recommended', 'plugin:vue/vue3-recommended', 'plugin:storybook/recommended'],
  rules: {
    'prettier/prettier': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 1
      },
      multiline: {
        max: 1
      }
    }]
  },
  globals: {
    $nuxt: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  }
};