const path = require('path');
const Generator = require('yeoman-generator');
const dashify = require('dashify');
const Redux = require('redux');
const logger = require('redux-node-logger');
const camelCase = require('camelcase');
const pascalCase = require('pascal-case');
const beautify = require('gulp-beautify');
const reducers = require('./reducers');
const common = require('./common');
const uiText = require('./ui-text');
const questions = require('./questions');

let store;
const errors = {};

module.exports = class VulcanGenerator extends Generator {
  constructor (args, options) {
    super(args, options);
    if (!store) {
      const allConfig = this.config.getAll();
      if (process.env.VULCANJS_SEE_REDUX_LOGS) {
        store = Redux.createStore(
          reducers,
          allConfig,
          Redux.applyMiddleware(logger())
        );
      } else {
        store = Redux.createStore(
          reducers,
          allConfig
        );
      }
    }
    this._registerArguments();
    this.registerTransformStream(
      beautify({ indent_size: 2 })
    );
    this.inputProps = {};
    this._getQuestion = questions.get.bind(this);
  }

  _registerArguments () {}

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
    !!store.getState().packages[packageName].modules[filteredModuleName];
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

  _getStoryBookSetupStatus () {
    return store.getState().storyBook.setupStatus;
  }

  /*
    Helpers that determine whether a task can be performed
  */

  _canPrompt () {
    return this._hasNoErrors();
  }

  _canWrite () {
    return this._hasNoErrors();
  }

  _canConfigure () {
    return this._hasNoErrors();
  }

  _canInstall () {
    return this._hasNoErrors();
  }


  /*
    Error management
  */

  _hasNoErrors () {
    const errorKeys = Object.keys(errors);
    return errorKeys.length === 0;
  }

  _logAllErrors () {
    const errorKeys = Object.keys(errors);
    const errorsArr = errorKeys.map(errorKey => errors[errorKey]);
    errorsArr.forEach((error, index) => {
      const errorNo = `Error (${index}):`;
      const message = `${errorNo} \n\n ${error.message}`;
      this.env.error(message);
    });
  }

  _assertIsVulcan () {
    if (!store.getState().isVulcan) {
      errors.notVulcan = {
        message: uiText.errors.notVulcan,
      };
    }
  }

  _assertIsNotVulcan () {
    if (store.getState().isVulcan) {
      errors.isVulcan = {
        message: uiText.errors.isVulcan,
      };
    }
  }

  _assertIsPackageExists (packageName) {
    if (!this._isPackageExists(packageName)) {
      errors.notPackageExists = {
        message: uiText.errors.notPackageExists(packageName),
      };
    }
  }

  _assertNotPackageExists (packageName) {
    if (this._isPackageExists(packageName)) {
      errors.isPackageExists = {
        message: uiText.errors.isPackageExists(packageName),
      };
    }
  }

  _assertIsModuleExists (packageName, moduleName) {
    if (!this._isModuleExists(packageName, moduleName)) {
      errors.notModuleExists = {
        message: uiText.errors.notModuleExists(packageName, moduleName),
      };
    }
  }

  _assertNotModuleExists (packageName, moduleName) {
    if (this._isModuleExists(packageName, moduleName)) {
      errors.isModuleExists = {
        message: uiText.errors.isModuleExists(packageName, moduleName),
      };
    }
  }

  _assertHasNonZeroPackages () {
    const packages = store.getState().packages;
    if (Object.keys(packages).length < 1) {
      errors.isZeroPackages = {
        message: uiText.errors.isZeroPackages,
      };
    }
  }

  _assertPackageHasNonZeroModules (packageName) {
    this._assertIsPackageExists(packageName);
    if (!this._packageHasNonZeroModules(packageName)) {
      errors.isZeroModules = {
        message: uiText.errors.isZeroModules(packageName),
      };
    }
  }

  /*
    Common string filters
  */

  _filterPackageName (packageName) {
    return dashify(packageName);
  }

  _filterAppName (appName) {
    return dashify(appName);
  }

  _filterModuleName (moduleName) {
    return camelCase(moduleName);
  }

  _end () {
    this._logAllErrors();
  }

  /*
    Filenames
  */

  _getComponentFileName () {
    return `${this.props.componentName}.${this._getReactExtension()}`;
  }


  /*
    Destination paths
  */

  _getPath (options, ...args) {
    const relativeToProjectRootPath = path.join(...args);
    const absolutePath = this.destinationPath(relativeToProjectRootPath);
    if (options.relativeTo) return path.relative(options.relativeTo, absolutePath);
    return options.isAbsolute ? absolutePath : relativeToProjectRootPath;
  }

  _getRootStoriesPath (options, ...args) {
    return this._getPath(
      options,
      '.stories',
      ...args
    );
  }

  _getPackagePath (options, ...args) {
    return this._getPath(
      options,
      'packages',
      this.props.packageName,
      ...args
    );
  }

  _getLibPath (options, ...args) {
    return this._getPackagePath(
      options,
      'lib',
      ...args
    );
  }

  _getModulesPath (options, ...args) {
    return this._getLibPath(
      options,
      'modules',
      ...args
    );
  }

  _getModulePath (options, ...args) {
    return this._getModulesPath(
      options,
      this.props.moduleName,
      ...args
    );
  }

  _getComponentsPath (options, ...args) {
    return this._getLibPath(
      options,
      'components',
      ...args
    );
  }

  _getModuleTestPath (options, ...args) {
    return this._getModulePath(
      options,
      'test',
      ...args
    );
  }

  _getPackageStoriesPath (options, ...args) {
    return this._getComponentsPath(
      options,
      '.stories.js',
      ...args
    );
  }

  _getModuleInComponentsPath (options, ...args) {
    return this._getComponentsPath(
      options,
      this.props.moduleName,
      ...args
    );
  }

  _getComponentPath (options) {
    return this._getModuleInComponentsPath(
      options,
      this._getComponentFileName()
    );
  }

  _getModuleStoriesPath (options) {
    return this._getModuleInComponentsPath(
      options,
      '.stories.js'
    );
  }

  _getClientPath (options, ...args) {
    return this._getLibPath(
      options,
      'client',
      ...args
    );
  }

  _getServerPath (options, ...args) {
    return this._getLibPath(
      options,
      'server',
      ...args
    );
  }

  /*
    Arguments
  */

  _registerAppNameOption () {
    this.option(
      'appname',
      {
        type: String,
        required: false,
        alias: 'n',
        desc: uiText.descriptions.appName,
      }
    );
  }

  _registerPackageNameOption () {
    this.option(
      'packagename',
      {
        type: String,
        required: false,
        alias: 'p',
        desc: uiText.descriptions.packageName,
      }
    );
  }

  _registerModuleNameOption () {
    this.option(
      'modulename',
      {
        type: String,
        required: false,
        alias: 'm',
        desc: uiText.descriptions.moduleName,
      }
    );
  }

  _registerComponentNameOption () {
    this.option(
      'componentname',
      {
        type: String,
        required: false,
        alias: 'c',
        desc: uiText.descriptions.componentName,
      }
    );
  }

  _registerReactExtensionOption () {
    this.option(
      'reactextension',
      {
        type: String,
        required: false,
        alias: 'rx',
        desc: uiText.descriptions.reactExtension,
      }
    );
  }

  _registerPackageManagerOption () {
    this.option(
      'packagemanager',
      {
        type: String,
        required: false,
        alias: 'pm',
        desc: uiText.descriptions.packageManager,
      }
    );
  }

  /*
    Prop finalizers
  */

  _getFinalPackageName (answers) {
    const packageName = (
      this.inputProps.packageName ||
      (this.props ? this.props.packageName : undefined) ||
      answers.packageName
    );
    return this._filterPackageName(packageName);
  }

  _getFinalModuleName (answers) {
    const moduleName = (
      this.inputProps.moduleName ||
      this.props ? this.props.packageName : undefined ||
      answers.moduleName
    );
    return this._filterModuleName(moduleName);
  }

  _getFinalPascalModuleName (answers) {
    const moduleName = (
      this.inputProps.moduleName ||
      this.props ? this.props.moduleName : undefined ||
      answers.moduleName
    );
    return pascalCase(moduleName);
  }

  _getFinalCamelModuleName (answers) {
    const moduleName = (
      this.inputProps.moduleName ||
      this.props ? this.props.moduleName : undefined ||
      answers.moduleName
    );
    return camelCase(moduleName);
  }

  _getFinalDefaultResolvers (answers) {
    return (
      this.inputProps.defaultResolvers ||
      this.props ? this.props.defaultResolvers : undefined ||
      answers.defaultResolvers
    );
  }

  _getFinalCollectionName (answers) {
    return this._getFinalPascalModuleName(answers);
  }

  _getFinalMutationName (answers, mutationType) {
    const camelModuleName = this._getFinalCamelModuleName(answers);
    return `${camelModuleName}${mutationType}`;
  }

  _getFinalPermissionName (answers, permission) {
    const camelModuleName = this._getFinalCamelModuleName(answers);
    console.log(camelModuleName);
    const permissionAppendage = permission.join('.');
    return `${camelModuleName}.${permissionAppendage}`;
  }

};
