const store = require('./store');
const uiText = require('./ui-text');

const isNonEmpty = input => !!input;

function combineValidators(...fns) {
  return function reducedValidator(input) {
    return fns.reduce((acc, curValidator) => {
      if (typeof acc === 'string') return acc;
      return curValidator(input);
    }, true);
  };
}

const assertNonEmpty = input => {
  if (isNonEmpty(input)) return true;
  return uiText.errors.isEmpty;
};

const assertNotPackageExists = input => {
  if (!store.is('packageExists', input)) return true;
  return uiText.errors.isPackageExists(input);
};

const assertNotModuleExists = (packageName, moduleName) => {
  if (!store.is('moduleExists', packageName, moduleName)) return true;
  return uiText.errors.isModuleExists(packageName, moduleName);
};

const generateNotModuleExists = packageName => input => assertNotModuleExists(packageName, input);

module.exports = {
  combineValidators: combineValidators,
  assertNonEmpty: assertNonEmpty,
  assertNotPackageExists: assertNotPackageExists,
  generateNotModuleExists: generateNotModuleExists
};
