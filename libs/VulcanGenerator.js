const Generator = require('yeoman-generator');
const common = require('./common.js');
const chalk = require('chalk');
const dashify = require('dashify');
const Redux = require('redux');
const reducers = require('./reducers');
const store = Redux.createStore(reducers);
console.log(store.getState());

module.exports = class VulcanGenerator extends Generator {
  constructor(args, options) {
    super(args, options);
    this.errors = {};
    common.beautify.bind(this)();
  }

  _getPackage(packageName) {
    return this._getConfigProps('packages')[packageName];
  }

  _getModules(packageName) {
    if (!this._packageExists(packageName)) { return []; }
    const thePackage = this._getPackage(packageName);
    const moduleNameKeys = Object.keys(thePackage.modules);
    return moduleNameKeys.map((key) => (thePackage.modules[key]));
  }

  _getModule(packageName, moduleName) {
    if (!this._packageExists(packageName)) return undefined;
    const thePackage = this._getPackage(packageName);
    return thePackage.modules[moduleName];
  }

  _moduleExists (packageName, moduleName) {
    return !!this._getModule(packageName, moduleName);
  }

  _packageExists (packageName) {
    return !!this._getPackage(packageName);
  }

  _registerNewModule (packageName, moduleName) {
    if (!this._packageExists(packageName)) {
      this._registerNewPackage(packageName);
    }

    if (!this._moduleExists(packageName, moduleName)) {
      const thePackage = this._getPackage(packageName);
      thePackage.modules[moduleName] = {};
      this._savePackage(packageName, thePackage);
    }
  }

  _registerNewPackage (packageName) {
    if (!this._packageExists(packageName)) {
      this._savePackage(packageName, {
        modules: {},
      });
    }
  }

  _savePackage(packageName, packageObj) {
    const packages = this._getConfigProps('packages');
    packages[packageName] = packageObj;
    this.config.set('packages', packages);
  }

  _getConfigProps (key) {
    const configProps = {
      reactExtension: this.config.get('reactExtension'),
      packages: this.config.get('packages'),
    };
    return configProps[key];
  }

  _checkVulcan () {
    if (!this.config.get('isVulcan')) {
      this.errors.notVulcan = {
        message: 'This is not a Vulcan.js project directory. \nYou cannot run Vulcan.js generators outside of a Vulcan.js project directory.',
      };
    }
  }

  _checkNotVulcan () {
    if (this.config.get('isVulcan')) {
      this.errors.isVulcan = {
        message: 'You are already in a Vulcan.js project directory. \nYou may not run this command inside a Vulcan.js project directory.'
      };
    }
  }

  _hasNoErrors() {
    const errorKeys = Object.keys(this.errors);
    return errorKeys.length === 0;
  }

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

  _logAllErrors() {
    const errorKeys = Object.keys(this.errors);
    const errors = errorKeys.map((errorKey) => this.errors[errorKey]);
    errors.forEach((error, index) => {
      const errorNo = chalk.white(`Error (${index}):`);
      const message = `${errorNo} \n\n` + chalk.red(error.message);
      this.env.error(message);
    });
  }

  _filterPackageName(packageName) {
    return dashify(packageName);
  }

  _filterAppName(appName) {
    return dashify(appName);
  }

  _end() {
    this._logAllErrors();
  }
}
