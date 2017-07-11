const uiText = require('./ui-text');

let generator;

const optionObjs = {
  appName: {
    type: String,
    required: false,
    alias: 'n',
    desc: uiText.descriptions.appName
  },
  packageName: {
    type: String,
    required: false,
    alias: 'p',
    desc: uiText.descriptions.packageName
  },
  modelName: {
    type: String,
    required: false,
    alias: 'm',
    desc: uiText.descriptions.modelName
  },
  componentName: {
    type: String,
    required: false,
    alias: 'c',
    desc: uiText.descriptions.componentName
  },
  packageManager: {
    type: String,
    required: false,
    alias: 'pm',
    desc: uiText.descriptions.packageManager
  }
};

function setup(generatorSetup) {
  generator = generatorSetup;
}

function register(...optionNames) {
  function registerSingleOption(optionName) {
    generator.option(optionName, optionObjs[optionName]);
  }

  optionNames.forEach(optionName => {
    registerSingleOption(optionName);
  });
}

module.exports = {
  setup: setup,
  register: register
};
