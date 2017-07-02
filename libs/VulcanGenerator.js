const Generator = require('yeoman-generator');
const common = require('./common.js');
const chalk = require('chalk');

module.exports = class VulcanGenerator extends Generator {
  constructor(args, options) {
    super(args, options);
    this.errors = [];
    this._checkVulcan();
    common.beautify.bind(this)();
  }

  _checkVulcan () {
    if (!this.config.get('isVulcan')) {
      this.errors.push({
        name: 'isVulcan',
        message: 'This is not a Vulcan.js project directory. You cannot run Vulcan.js generators outside of Vulcan.js project directories.',
      });
    }
  }

  _hasNoErrors() {
    return this.errors.length === 0;
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

  _logAllErrors() {
    this.errors.forEach((error) => {
      this.env.error(chalk.red(error.message));
    });
  }
}
