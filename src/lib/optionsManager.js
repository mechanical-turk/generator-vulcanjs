const uiText = require('./ui-text');

let generator;

function setup (generatorSetup) {
  generator = generatorSetup;
}

function register (...optionNames) {
  function appName () {
    generator.option(
      'appname',
      {
        type: String,
        required: false,
        alias: 'n',
        desc: uiText.descriptions.appName,
      }
    );
  }

  function packageName () {
    generator.option(
      'packagename',
      {
        type: String,
        required: false,
        alias: 'p',
        desc: uiText.descriptions.packageName,
      }
    );
  }

  function moduleName () {
    generator.option(
      'modulename',
      {
        type: String,
        required: false,
        alias: 'm',
        desc: uiText.descriptions.moduleName,
      }
    );
  }

  function componentName () {
    generator.option(
      'componentname',
      {
        type: String,
        required: false,
        alias: 'c',
        desc: uiText.descriptions.componentName,
      }
    );
  }

  function reactExtension () {
    generator.option(
      'reactextension',
      {
        type: String,
        required: false,
        alias: 'rx',
        desc: uiText.descriptions.reactExtension,
      }
    );
  }

  function packageManager () {
    generator.option(
      'packagemanager',
      {
        type: String,
        required: false,
        alias: 'pm',
        desc: uiText.descriptions.packageManager,
      }
    );
  }

  function registerSingleOption (optionName) {
    switch (optionName) {
      case 'appName': return appName();
      case 'packageName': return packageName();
      case 'moduleName': return moduleName();
      case 'componentName': return componentName();
      case 'reactExtension': return reactExtension();
      case 'packageManager': return packageManager();
      default: return undefined;
    }
  }

  optionNames.forEach((optionName) => {
    registerSingleOption(optionName);
  });
}

module.exports = {
  setup,
  register,
};
