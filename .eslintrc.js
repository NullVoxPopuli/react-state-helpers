module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
      // Don't care about this
      "import/prefer-default-export": 0,

      // I think sans parenthesis around single argument functions looks better
      // http://eslint.org/docs/rules/arrow-parens#as-needed
      "arrow-parens": ["error", "as-needed"],

      // functions don't need to be defined before used, because the scripts
      // don't evaluate any functions on load.
      // http://eslint.org/docs/rules/no-use-before-define#functions
      "no-use-before-define": ["error", { "functions": false }],

      // It's often helpful to always have formal arguments, even
      // if they aren't used.
      // http://eslint.org/docs/rules/no-unused-vars#argsignorepattern
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
};
