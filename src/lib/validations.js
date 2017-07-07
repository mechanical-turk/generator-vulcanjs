const store = require('./store');
const uiText = require('./ui-text');

function combineValidators (...fns) {
  return function reducedValidator (input) {
    return fns.reduce(
      (acc, curValidator) => {
        if (typeof acc === 'string') return acc;
        return curValidator(input);
      },
      true
    );
  };
}

const assertNonEmpty = (input) => {
  if (input) return true;
  return uiText.errors.isEmpty;
};

const assertNotPackageExists = (packageName) => {
  if (!store.is('packageExists', packageName)) return true;
  return uiText.errors.isPackageExists(packageName);
};

const assertNotModuleExists = (packageName, moduleName) => {
  if (!store.is('moduleExists', packageName, moduleName)) return true;
  return uiText.errors.isModuleExists(packageName, moduleName);
};

const generateNotModuleExists = (packageName) => (
  (input) => assertNotModuleExists(packageName, input)
);

module.exports = {
  combineValidators,
  assertNonEmpty,
  assertNotPackageExists,
  generateNotModuleExists,
};
