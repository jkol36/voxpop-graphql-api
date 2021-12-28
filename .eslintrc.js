module.exports = {
  "extends": ["airbnb", "airbnb/hooks"],
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "serviceworker": true,
  },
  "plugins": [
    "react",
    "jsx-a11y",
  ],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
    },
  },
  "globals": {
    "moment": true,
    "Rollbar": true,
  },
  "rules": {
    "prefer-destructuring": 1,
    "no-buffer-constructor": 1,
    "react/destructuring-assignment": 1,
    "react/no-unused-state": 1,
    "react/no-access-state-in-setstate": 1,
    "react/sort-comp": 1,
    "react/button-has-type": 1,
    "no-restricted-globals": 1,
    "jsx-a11y/label-has-associated-control": 1,
    "no-param-reassign": 1,
    "no-plusplus": 0,
    "operator-linebreak": ["error", "after"],
    "semi": [
      2,
      "never",
    ],
    "arrow-parens": [
      "error",
      "always",
    ],
    "arrow-body-style": [
      2,
      "as-needed",
    ],
    "prefer-arrow-callback": 2,
    "comma-dangle": [
      2,
      "always-multiline",
    ],
    "import/imports-first": 0,
    "import/newline-after-import": 0,
    "import/no-dynamic-require": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-named-as-default": 0,
    "import/no-unresolved": 2,
    "import/prefer-default-export": 0,
    "import/no-cycle": 0,
    "import/no-named-as-default-member": 0,
    "indent": [
      2,
      2,
      {
        "SwitchCase": 1,
      },
    ],
    "jsx-a11y/aria-props": 2,
    "jsx-a11y/heading-has-content": 0,
    "jsx-a11y/label-has-for": "off",
    "jsx-a11y/mouse-events-have-key-events": 2,
    "jsx-a11y/role-has-required-aria-props": 2,
    "jsx-a11y/role-supports-aria-props": 2,
    "jsx-a11y/media-has-caption": 0,
    "jsx-a11y/no-autofocus": 0,
    "max-len": 0,
    "newline-per-chained-call": 0,
    "no-confusing-arrow": 0,
    "no-console": 1,
    "no-use-before-define": 0,
    "prefer-template": 2,
    "class-methods-use-this": 0,
    "react/forbid-prop-types": 0,
    "react/jsx-first-prop-new-line": [
      2,
      "multiline",
    ],
    "react/jsx-filename-extension": 0,
    "react/jsx-no-target-blank": 0,
    "react/require-extension": 0,
    "react/self-closing-comp": 0,
    "require-yield": 0,
    "import/no-webpack-loader-syntax": 0,
    "react/require-default-props": 0,
    "react/no-array-index-key": 0,
    "jsx-a11y/href-no-hash": "off",
    "react/no-did-update-set-state": 0,
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": "./webpack/webpack.prod.babel.js",
      },
    },
  },
}










