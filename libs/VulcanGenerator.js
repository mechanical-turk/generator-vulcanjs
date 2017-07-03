const Generator = require('yeoman-generator');
const common = require('./common.js');
const chalk = require('chalk');
const dashify = require('dashify');
const Redux = require('redux');
const reducers = require('./reducers');
const logger = require('redux-node-logger');
let store;
const errors = {};
const camelCase = require('camelcase');

module.exports = class VulcanGenerator extends Generator {
  constructor(args, options) {
    super(args, options);
    if (!store) {
      const allConfig = this.config.getAll();
      store = Redux.createStore(
        reducers,
        allConfig,
        Redux.applyMiddleware(logger())
      );
    }
    common.beautify.bind(this)();
  }

  /*
    State management
  */

  _commitStore () {
    const storeKeys = Object.keys(store.getState());
    storeKeys.forEach((key) => {
      this.config.set(key, store.getState()[key]);
    });
  }

  _dispatch (action) {
    return store.dispatch(action);
  }


  /*
    State access helpers
  */

  _isPackageExists (packageName) {
    const filteredPackageName = this._filterPackageName(packageName);
    return !!store.getState().packages[filteredPackageName];
  }

  _isModuleExists (packageName, moduleName) {
    const filteredModuleName = this._filterModuleName(moduleName);
    return (this._isPackageExists(packageName)) &&
    !!store.getState().packages[packageName].modules[moduleName];
  }

  _packageHasNonZeroModules (packageName) {
    if (!this._isPackageExists(packageName)) return false;
    const thePackage = this._getPackage(packageName);
    const moduleNames = Object.keys(thePackage.modules);
    return moduleNames.length > 0;
  }

  _getReactExtension () {
    return store.getState().reactExtension;
  }

  _getPackageNames () {
    const packages = store.getState().packages;
    const packageNames = Object.keys(packages);
    return packageNames.sort(common.alphabeticalSort);
  }

  _getModuleNames (packageName) {
    const thePackage = this._getPackage(packageName);
    const modules = this._isPackageExists(packageName) ?
      thePackage.modules :
      {};
    const moduleNames = Object.keys(modules);
    return moduleNames.sort(common.alphabeticalSort);
  }

  _getPackage (packageName) {
    return store.getState().packages[packageName];
  }

  /*
    Helpers that determine whether a task can be performed
  */

  _canPrompt() {
    return this._hasNoErrors();
  }

  _canWrite() {
    return this._hasNoErrors();
  }

  _canConfigure() {
    return this._hasNoErrors();
  }

  _canInstall() {
    return this._hasNoErrors();
  }



  /*
    Error management
  */

  _hasNoErrors() {
    const errorKeys = Object.keys(errors);
    return errorKeys.length === 0;
  }

  _logAllErrors() {
    const errorKeys = Object.keys(errors);
    const errorsArr = errorKeys.map((errorKey) => errors[errorKey]);
    errorsArr.forEach((error, index) => {
      if (error.isLogged) { return; }
      const errorNo = `Error (${index}):`;
      const message = `${errorNo} \n\n` + error.message;
      this.env.error(message);
      error.isLogged = true;
    });
  }

  _assertIsVulcan () {
    if (!store.getState().isVulcan) {
      errors.notVulcan = {
        message: 'This is not a Vulcan.js project directory. \nYou cannot run Vulcan.js generators outside of a Vulcan.js project directory.',
      };
    }
  }

  _assertIsNotVulcan () {
    if (store.getState().isVulcan) {
      errors.isVulcan = {
        message: `You are already in a Vulcan.js project directory. \nYou may not run this command inside a Vulcan.js project directory.`
      };
    }
  }

  _assertIsPackageExists (packageName) {
    if (!this._isPackageExists(packageName)) {
      errors.notPackageExists = {
        message: `The package ${packageName} does not exist. \nIf you'd like to work on this package, you should create it first by running: ${chalk.green(`vulcanjs:package ${packageName}`)}`,
      };
    }
  }

  _assertNotPackageExists (packageName) {
    if (this._isPackageExists(packageName)) {
      errors.isPackageExists = {
        message: `A package with the name: '${packageName}' already exists. \nIf you'd like to overwrite this package, you should first run ${chalk.green(`vulcanjs:remove package --p ${packageName}`)}.`,
      };
    }
  }

  _assertModuleIsExists (packageName, moduleName) {
    if (!this._isModuleExists(packageName, moduleName)) {
      errors.notModuleExists = {
        message: `A module with the name: '${moduleName}' under the package '${packageName}' does not exists. \nIf you'd like to work on this module, you should first run ${chalk.green(`vulcanjs:module --p ${packageName} --m ${moduleName}`)}.`,
      }
    }
  }

  _assertModuleNotExists (packageName, moduleName) {
    if (this._isModuleExists(packageName, moduleName)) {
      errors.isModuleExists = {
        message: `A module with the name: '${moduleName}' under the package '${packageName}' already exists. \nIf you'd like to overwrite this module, you should first run ${chalk.green(`vulcanjs:remove module --p ${packageName} --m ${moduleName}`)}.`,
      };
    }
  }

  _assertHasNonZeroPackages () {
    const packages = store.getState().packages;
    if (Object.keys(packages).length < 1) {
      errors.isZeroPackages = {
        message: `The command you just ran requires at least 1 package. \nTo create a package, run ${chalk.green('vulcanjs:package')}`,
      };
    }
  }

  _assertPackageHasNonZeroModules (packageName) {
    this._assertIsPackageExists(packageName);
    if (!this._packageHasNonZeroModules(packageName)) {
      errors.isZeroModules = {
        message: `The command you just ran requires at least 1 module in the package: '${packageName}'. \nTo create a module in ${packageName}, run ${chalk.green(`vulcanjs:module --p ${packageName}`)}`
      };
    }
  }

  /*
    Common string filters
  */

  _filterPackageName(packageName) {
    return dashify(packageName);
  }

  _filterAppName(appName) {
    return dashify(appName);
  }

  _filterModuleName(moduleName) {
    return camelCase(moduleName);
  }

  _end() {
    this._logAllErrors();
  }
}
