const uiText = require('./ui-text');

const isNonEmpty = input => !!input;

const assertNonEmpty = input => {
  if (isNonEmpty(input)) return true;
  return uiText.errors.isEmpty;
};

module.exports = {
  assertNonEmpty: assertNonEmpty
};
