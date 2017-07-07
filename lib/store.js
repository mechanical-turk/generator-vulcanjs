const Redux = require('redux');
const logger = require('redux-node-logger');
const reducers = require('./reducers');
const filter = require('./filters').filter;
const common = require('./common');

let store = {};

function init(props) {
  if (process.env.VULCANJS_SEE_REDUX_LOGS) {
    store = Redux.createStore(reducers, props, Redux.applyMiddleware(logger()));
  } else {
    store = Redux.createStore(reducers, props);
  }
  return store;
}

function is(checkType, ...args) {
  function vulcan() {
    return !!store.getState().isVulcan;
  }

  function packageExists(packageName) {
    const filteredPackageName = filter('packageName', packageName);
    return !!store.getState().packages[filteredPackageName];
  }

  function moduleExists(packageName, moduleName) {
    const filteredModuleName = filter('moduleName', moduleName);
    return packageExists(packageName) && !!store.getState().packages[packageName].modules[filteredModuleName];
  }

  switch (checkType) {
    case 'packageExists':
      return packageExists(...args);
    case 'moduleExists':
      return moduleExists(...args);
    case 'vulcan':
      return vulcan(...args);
    default:
      return undefined;
  }
}

function get(checkType, ...args) {
  function reactExtension() {
    return store.getState().reactExtension;
  }

  function packageNames() {
    const packages = store.getState().packages;
    const packageNamesToGet = Object.keys(packages);
    return packageNamesToGet.sort(common.alphabeticalSort);
  }

  function getPackage(packageName) {
    return store.getState().packages[packageName];
  }

  function moduleNames(packageName) {
    const thePackage = getPackage(packageName);
    const modules = is('packageExists', packageName) ? thePackage.modules : {};
    const moduleNamesToGet = Object.keys(modules);
    return moduleNamesToGet.sort(common.alphabeticalSort);
  }

  function storyBookSetupStatus() {
    return store.getState().storyBook.setupStatus;
  }

  switch (checkType) {
    case 'reactExtension':
      return reactExtension(...args);
    case 'packageNames':
      return packageNames(...args);
    case 'moduleNames':
      return moduleNames(...args);
    case 'package':
      return getPackage(...args);
    case 'storyBookSetupStatus':
      return storyBookSetupStatus(...args);
    default:
      return undefined;
  }
}

function has(checkType, ...args) {
  function nonZeroPackages() {
    const packageNames = get('packageNames');
    return Object.keys(packageNames).length > 0;
  }

  function nonZeroModules(packageName) {
    if (!this._isPackageExists(packageName)) return false;
    const thePackage = this._getPackage(packageName);
    const moduleNames = Object.keys(thePackage.modules);
    return moduleNames.length > 0;
  }

  switch (checkType) {
    case 'nonZeroModules':
      return nonZeroModules(...args);
    case 'nonZeroPackages':
      return nonZeroPackages(...args);
    default:
      return undefined;
  }
}

function set() {}

module.exports = {
  init: init,
  is: is,
  has: has,
  get: get,
  set: set
};
