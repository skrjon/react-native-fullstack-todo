const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  'parser': 'babel-eslint',
  'extends': [require('../.eslintrc.js'), 'plugin:react/recommended'],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    }
  },
  'plugins': [
    'react',
    'react-native'
  ],
  'globals': {
    'cancelAnimationFrame': true,
    'fetch': true,
    'requestAnimationFrame': true
  },
  'rules': {
    'jsx-quotes': ERROR,
    'react/jsx-handler-names': OFF,
    'react/jsx-indent': [WARNING, 2],
    'react/jsx-indent-props': [WARNING, 2],
    'react/jsx-max-props-per-line': OFF,
    'react/jsx-equals-spacing': WARNING,
    'react/jsx-tag-spacing': ERROR,
    'react/jsx-first-prop-new-line': WARNING,
    'react/jsx-pascal-case': ERROR,
    'react/jsx-sort-props': WARNING,
    'react/jsx-space-before-closing': WARNING,
    'react/jsx-wrap-multilines': WARNING,
    'react/prop-types': OFF,
    'react-native/no-inline-styles': ERROR,
    'react-native/no-unused-styles': ERROR,
  },
};