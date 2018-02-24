const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  'extends': 'eslint:recommended',
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true
    }
  },
  'rules': {
    // Possible Errors
    // http://eslint.org/docs/rules/#possible-errors
    // ---------------------------------------------
    'for-direction': OFF,
    'no-await-in-loop': OFF,
    'no-compare-neg-zero': ERROR, // eslint:recommended
    'no-cond-assign': ERROR, // eslint:recommended
    'no-console': OFF, // eslint:recommended
    'no-constant-condition': ERROR, // eslint:recommended
    'no-control-regex': ERROR, // eslint:recommended
    'no-debugger': ERROR, // eslint:recommended
    'no-dupe-args': ERROR, // eslint:recommended
    'no-dupe-keys': ERROR, // eslint:recommended
    'no-duplicate-case': ERROR, // eslint:recommended
    'no-empty': ERROR, // eslint:recommended
    'no-empty-character-class': ERROR, // eslint:recommended
    'no-ex-assign': ERROR, // eslint:recommended
    'no-extra-boolean-cast': ERROR, // eslint:recommended
    'no-extra-parens': OFF,
    'no-extra-semi': ERROR, // eslint:recommended
    'no-func-assign': ERROR, // eslint:recommended
    'no-inner-declarations': ERROR, // eslint:recommended
    'no-invalid-regexp': ERROR, // eslint:recommended
    'no-irregular-whitespace': ERROR, // eslint:recommended
    'no-obj-calls': ERROR, // eslint:recommended
    'no-prototype-builtins': OFF,
    'no-regex-spaces': ERROR, // eslint:recommended
    'no-sparse-arrays': ERROR, // eslint:recommended
    'no-template-curly-in-string': OFF,
    'no-unexpected-multiline': 2, // eslint:recommended
    'no-unreachable': ERROR, // eslint:recommended
    'no-unsafe-finally': ERROR, // eslint:recommended
    'no-unsafe-negation': OFF,
    'use-isnan': ERROR, // eslint:recommended
    'valid-jsdoc': [OFF, {
      requireParamDescription: false,
      requireReturnDescription: false,
      requireReturn: false,
      prefer: {returns: 'return'},
    }],
    'valid-typeof': ERROR, // eslint:recommended

    // Best Practices
    // http://eslint.org/docs/rules/#best-practices
    // --------------------------------------------

    'accessor-pairs': OFF,
    'array-callback-return': OFF,
    'block-scoped-var': OFF,
    'class-methods-use-this': OFF,
    'complexity': OFF,
    'consistent-return': OFF,
    'curly': [ERROR, 'multi-line'],
    'default-case': OFF,
    'dot-location': OFF,
    'dot-notation': OFF,
    'eqeqeq': OFF,
    'guard-for-in': ERROR,
    'no-alert': OFF,
    'no-caller': ERROR,
    'no-case-declarations': ERROR, // eslint:recommended
    'no-div-regex': OFF,
    'no-else-return': OFF,
    'no-empty-function': OFF,
    'no-empty-pattern': ERROR, // eslint:recommended
    'no-eq-null': OFF,
    'no-eval': OFF,
    'no-extend-native': ERROR,
    'no-extra-bind': ERROR,
    'no-extra-label': OFF,
    'no-fallthrough': ERROR, // eslint:recommended
    'no-floating-decimal': OFF,
    'no-global-assign': OFF,
    'no-implicit-coercion': OFF,
    'no-implicit-globals': OFF,
    'no-implied-eval': OFF,
    'no-invalid-this': OFF,
    'no-iterator': OFF,
    'no-labels': OFF,
    'no-lone-blocks': OFF,
    'no-loop-func': OFF,
    'no-magic-numbers': OFF,
    'no-multi-spaces': ERROR,
    'no-multi-str': ERROR,
    'no-new': OFF,
    'no-new-func': OFF,
    'no-new-wrappers': ERROR,
    'no-octal': ERROR, // eslint:recommended
    'no-octal-escape': OFF,
    'no-param-reassign': OFF,
    'no-proto': OFF,
    'no-redeclare': ERROR, // eslint:recommended
    'no-restricted-properties': OFF,
    'no-return-assign': OFF,
    'no-script-url': OFF,
    'no-self-assign': ERROR, // eslint:recommended
    'no-self-compare': OFF,
    'no-sequences': OFF,
    'no-throw-literal': ERROR, // eslint:recommended
    'no-unmodified-loop-condition': OFF,
    'no-unused-expressions': OFF,
    'no-unused-labels': ERROR, // eslint:recommended
    'no-useless-call': OFF,
    'no-useless-concat': OFF,
    'no-useless-escape': OFF,
    'no-void': OFF,
    'no-warning-comments': OFF,
    'no-with': ERROR,
    'prefer-promise-reject-errors': OFF,
    'radix': OFF,
    'require-await': OFF,
    'vars-on-top': OFF,
    'wrap-iife': OFF,
    'yoda': OFF,

    // Strict Mode
    // http://eslint.org/docs/rules/#strict-mode
    // -----------------------------------------
    'strict': OFF,

    // Variables
    // http://eslint.org/docs/rules/#variables
    // ---------------------------------------
    'init-declarations': OFF,
    'no-catch-shadow': OFF,
    'no-delete-var': ERROR, // eslint:recommended
    'no-label-var': OFF,
    'no-restricted-globals': [ERROR, 'fdescribe', 'fit'],
    'no-shadow': OFF,
    'no-shadow-restricted-names': OFF,
    'no-undef': ERROR, // eslint:recommended
    'no-undef-init': ERROR,
    'no-undefined': OFF,
    'no-unused-vars': [ERROR, {args: 'none'}], // eslint:recommended
    'no-use-before-define': OFF,

    // Node.js and CommonJS
    // http://eslint.org/docs/rules/#nodejs-and-commonjs
    // -------------------------------------------------
    'callback-return': OFF,
    'global-require': OFF,
    'handle-callback-err': OFF,
    'no-buffer-constructor': OFF,
    'no-mixed-requires': OFF,
    'no-new-require': OFF,
    'no-path-concat': OFF,
    'no-process-env': OFF,
    'no-process-exit': OFF,
    'no-restricted-modules': OFF,
    'no-sync': OFF,

    // Stylistic Issues
    // http://eslint.org/docs/rules/#stylistic-issues
    // ----------------------------------------------
    'array-bracket-newline': OFF, // eslint:recommended
    'array-bracket-spacing': [OFF, 'never'], // TODO Evaluate this
    'array-element-newline': OFF, // eslint:recommended
    'block-spacing': [ERROR, 'never'],
    'brace-style': ERROR,
    'camelcase': [OFF, {properties: 'never'}],
    'capitalized-comments': OFF,
    'comma-dangle': [ERROR, 'always-multiline'],
    'comma-spacing': ERROR,
    'comma-style': ERROR,
    'computed-property-spacing': ERROR,
    'consistent-this': OFF,
    'eol-last': OFF,
    'func-call-spacing': ERROR,
    'func-name-matching': OFF,
    'func-names': OFF,
    'func-style': OFF,
    'id-blacklist': OFF,
    'id-length': OFF,
    'id-match': OFF,
    'indent': [ERROR, 2, {
      'FunctionDeclaration': {
        'parameters': 'first'
      },
      'FunctionExpression': {
        'parameters': 'first'
      },
      'SwitchCase': 1
    }],
    'jsx-quotes': OFF,
    'key-spacing': ERROR,
    'keyword-spacing': ERROR,
    'line-comment-position': OFF,
    'linebreak-style': ERROR,
    'lines-around-comment': OFF,
    'max-depth': OFF,
    'max-len': [ERROR, {
      code: 120,
      tabWidth: 2,
      ignoreUrls: true,
    }],
    'max-lines': OFF,
    'max-nested-callbacks': OFF,
    'max-params': OFF,
    'max-statements': OFF,
    'max-statements-per-line': OFF,
    'multiline-ternary': OFF,
    'new-cap': OFF, // Evaluate this/ Ratio is broken in the app
    'new-parens': OFF,
    'newline-per-chained-call': OFF,
    'no-array-constructor': ERROR,
    'no-bitwise': OFF,
    'no-continue': OFF,
    'no-inline-comments': OFF,
    'no-lonely-if': OFF,
    'no-mixed-operators': OFF,
    'no-mixed-spaces-and-tabs': ERROR, // eslint:recommended
    'no-multi-assign': OFF,
    'no-multiple-empty-lines': [ERROR, {max: 1}],
    'no-negated-condition': OFF,
    'no-nested-ternary': OFF,
    'no-new-object': ERROR,
    'no-plusplus': OFF,
    'no-restricted-syntax': OFF,
    'no-tabs': ERROR,
    'no-ternary': OFF,
    'no-trailing-spaces': ERROR,
    'no-underscore-dangle': OFF,
    'no-unneeded-ternary': OFF,
    'no-whitespace-before-property': ERROR,
    'nonblock-statement-body-position': OFF,
    'object-curly-newline': OFF,
    'object-curly-spacing': OFF, // TODO: Perhaps require spacing
    'object-property-newline': OFF,
    'one-var': [ERROR, {
      var: 'never',
      let: 'never',
      const: 'never',
    }],
    'one-var-declaration-per-line': OFF,
    'operator-assignment': OFF,
    'operator-linebreak': OFF,
    'padded-blocks': [ERROR, 'never'],
    'padding-line-between-statements': OFF,
    'quote-props': [ERROR, 'consistent'],
    'quotes': [ERROR, 'single', {allowTemplateLiterals: true}],
    'require-jsdoc': [OFF, {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
      },
    }],
    'semi': ERROR,
    'semi-spacing': ERROR,
    'semi-style': OFF,
    'sort-keys': ERROR,
    'sort-vars': OFF,
    'space-before-blocks': ERROR,
    'space-before-function-paren': [ERROR, {
      asyncArrow: 'always',
      anonymous: 'never',
      named: 'never',
    }],
    'space-in-parens': OFF,
    'space-infix-ops': ERROR,
    'space-unary-ops': OFF,
    'spaced-comment': [OFF, 'always'], //TODO: Evaluate this
    'switch-colon-spacing': ERROR,
    'template-tag-spacing': OFF,
    'unicode-bom': OFF,
    'wrap-regex': OFF,

    // ECMAScript 6
    // http://eslint.org/docs/rules/#ecmascript-6
    // ------------------------------------------
    'arrow-body-style': OFF,
    'arrow-parens': [OFF, 'always'],
    'arrow-spacing': OFF,
    'constructor-super': ERROR, // eslint:recommended
    'generator-star-spacing': [ERROR, 'after'],
    'no-class-assign': OFF,
    'no-confusing-arrow': OFF,
    'no-const-assign': OFF, // eslint:recommended
    'no-dupe-class-members': OFF, // eslint:recommended
    'no-duplicate-imports': OFF,
    'no-new-symbol': ERROR, // eslint:recommended
    'no-restricted-imports': OFF,
    'no-this-before-super': ERROR, // eslint:recommended
    'no-useless-computed-key': OFF,
    'no-useless-constructor': OFF,
    'no-useless-rename': OFF,
    'no-var': ERROR,
    'object-shorthand': OFF,
    'prefer-arrow-callback': OFF,
    'prefer-const': OFF,
    'prefer-destructuring': OFF,
    'prefer-numeric-literals': OFF,
    'prefer-rest-params': ERROR,
    'prefer-spread': ERROR,
    'prefer-template': OFF,
    'require-yield': ERROR, // eslint:recommended
    'rest-spread-spacing': ERROR,
    'sort-imports': OFF,
    'symbol-description': OFF,
    'template-curly-spacing': OFF,
    'yield-star-spacing': [ERROR, 'after'],
  },
  'env': {
    'es6': true,
    'node': true,
    'jest': true
  }
};
