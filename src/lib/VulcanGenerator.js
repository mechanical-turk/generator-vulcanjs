const path = require('path');
const Generator = require('yeoman-generator');
const beautify = require('gulp-beautify');
const uiText = require('./ui-text');
const questions = require('./questions');
const finalizers = require('./finalizers');
const assertions = require('./assertions');
const storeFactory = require('./store');

let store;
let errors;

module.exports = class VulcanGenerator extends Generator {
  constructor (args, options) {
    super(args, options);
    if (!store) {
      const allConfig = this.config.getAll();
      store = storeFactory.init(allConfig);
    }
    if (!errors) {
      errors = assertions.errors;
    }
    this._registerArguments();
    this.registerTransformStream(
      beautify({ indent_size: 2 })
    );
    this.inputProps = {};
    this.props = {};
    this._getQuestion = questions.get.bind(this);
    finalizers.setup(this.inputProps, this.props);
    this._finalize = finalizers.finalize.bind(this);
    this._assert = assertions.assert;
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

  /*
    Common string filters
  */

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
};
