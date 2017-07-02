const Generator = require('yeoman-generator');
const common = require('./common.js');
const chalk = require('chalk');

module.exports = class VulcanGenerator extends Generator {
  constructor(args, options) {
    super(args, options);
    this.errors = {};
    common.beautify.bind(this)();
  }

  _checkVulcan () {
    if (!this.config.get('isVulcan')) {
      this.errors.notVulcan = {
        name: 'notVulcan',
        message: 'This is not a Vulcan.js project directory. \nYou cannot run Vulcan.js generators outside of a Vulcan.js project directory.',
      };
    }
  }

  _checkNotVulcan () {
    if (this.config.get('isVulcan')) {
      this.errors.isVulcan = {
        name: 'isVulcan',
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
    errors.forEach((error) => {
      this.env.error(chalk.red(error.message));
    });
  }

  _end() {
    this._logAllErrors();
  }
}
