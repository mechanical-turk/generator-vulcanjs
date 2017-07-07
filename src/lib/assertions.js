const store = require('./store');
const uiText = require('./ui-text');

const errors = {};

function assert (assertion, ...args) {
  function isVulcan () {
    if (!store.is('vulcan')) {
      errors.notVulcan = {
        message: uiText.errors.notVulcan,
      };
    }
  }

  function notVulcan () {
    if (store.is('vulcan')) {
      errors.isVulcan = {
        message: uiText.errors.isVulcan,
      };
    }
  }

  function isPackageExists (packageName) {
    if (!store.is('packageExists', packageName)) {
      errors.notPackageExists = {
        message: uiText.errors.notPackageExists(packageName),
      };
    }
  }

  function notPackageExists (packageName) {
    if (store.is('packageExists', packageName)) {
      errors.isPackageExists = {
        message: uiText.errors.isPackageExists(packageName),
      };
    }
  }

  function isModuleExists (packageName, moduleName) {
    if (!store.is('moduleExists', packageName, moduleName)) {
      errors.notModuleExists = {
        message: uiText.errors.notModuleExists(packageName, moduleName),
      };
    }
  }

  function notModuleExists (packageName, moduleName) {
    if (store.is('moduleExists', packageName, moduleName)) {
      errors.isModuleExists = {
        message: uiText.errors.isModuleExists(packageName, moduleName),
      };
    }
  }

  function hasNonZeroPackages () {
    if (!store.has('nonZeroPackages')) {
      errors.isZeroPackages = {
        message: uiText.errors.isZeroPackages,
      };
    }
  }

  function packageHasNonZeroModules (packageName) {
    this._assertIsPackageExists(packageName);
    if (!this._packageHasNonZeroModules(packageName)) {
      errors.hasZeroModules = {
        message: uiText.errors.hasZeroModules(packageName),
      };
    }
  }

  switch (assertion) {
    case 'isVulcan' : return isVulcan(...args);
    case 'notVulcan' : return notVulcan(...args);
    case 'isPackageExists' : return isPackageExists(...args);
    case 'notPackageExists' : return notPackageExists(...args);
    case 'isModuleExists' : return isModuleExists(...args);
    case 'notModuleExists' : return notModuleExists(...args);
    case 'hasNonZeroPackages' : return hasNonZeroPackages(...args);
    case 'packageHasNonZeroModules' : return packageHasNonZeroModules(...args);
    default : return undefined;
  }
}

module.exports = {
  assert,
  errors,
};
