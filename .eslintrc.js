module.exports = {
    "extends": "airbnb-base",
    "rules": {
      "space-before-function-paren": ["error", "always"],
      "comma-dangle": ["error", {
        "arrays": "always",
        "objects": "always",
        "imports": "ignore",
        "exports": "ignore",
        "functions": "never",
      }],
      "no-underscore-dangle": ["error", {
        "allowAfterThis": true
      }],
   }
};
