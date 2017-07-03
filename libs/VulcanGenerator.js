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
    return (this._isPackageExists()) &&
    !!store.getState().packages[packageName].modules[moduleName];
  }

  // _addPackage (packageName) {
  //   const filteredPackageName = this._filterPackageName(packageName);
  //   return store.dispatch({
  //     type: 'ADD_PACKAGE',
  //     packageName: filteredPackageName,
  //   });
  // }
  //
  // _addModule (packageName, moduleName) {
  //   const filteredPackageName = this._filterPackageName(packageName);
  //   const filteredModuleName = this._filterModuleName(moduleName);
  //   return store.dispatch({
  //     type: 'ADD_MODULE',
  //     packageName: filteredPackageName,
  //     moduleName: filteredModuleName,
  //   });
  // }
  //
  // _setReactExtension (extension) {
  //   return store.dispatch({
  //     type: ''
  //   })
  // }


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

  _assertPackageNotExists (packageName) {
    const filteredPackageName = this._filterPackageName(packageName);
    if (!!store.getState().packages[filteredPackageName]) {
      errors.isPackageExists = {
        message: `A package with the name: '${filteredPackageName}' already exists. \nIf you'd like to overwrite this package, you should run ${chalk.green(`vulcanjs:remove package --p ${filteredPackageName}`)} first.`,
      };
    }
  }

  _assertModuleNotExists (packageName, moduleName) {
    const filteredPackageName = this._filterPackageName(packageName);
    const filteredModuleName = this._filterModuleName(moduleName);
    const thePackage = store.getState().packages[packageName];
    if (!thePackage) return true;
    if (!!thePackage.modules[filteredModuleName]) {
      errors.isModuleExists = {
        message: `A module with the name: '${filteredModuleName}' under the package '${filteredPackageName}' already exists. \nIf you'd like to overwrite this module, you should run ${chalk.green(`vulcanjs:remove module --p ${filteredPackageName} --m ${filteredModuleName}`)} first.`,
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
