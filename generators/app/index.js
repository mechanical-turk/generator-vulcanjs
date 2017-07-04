'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _common = require('../../lib/common');

var _common2 = _interopRequireDefault(_common);

var _VulcanGenerator = require('../../lib/VulcanGenerator');

var _VulcanGenerator2 = _interopRequireDefault(_VulcanGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _VulcanGenerator2.default {
  _registerArguments() {
    this.option('appname', {
      type: String,
      required: false,
      alias: 'n',
      desc: _common2.default.descriptions.appName
    });
    this.option('reactextension', {
      type: String,
      required: false,
      alias: 'rx',
      desc: _common2.default.descriptions.reactExtension
    });
    this.option('packagemanager', {
      type: String,
      required: false,
      alias: 'pm',
      desc: _common2.default.descriptions.packageManager
    });
  }

  initializing() {
    this._assertIsNotVulcan();
    this.inputProps = {};
  }

  prompting() {
    if (!this._canPrompt()) {
      return;
    }
    const questions = [{
      type: 'input',
      name: 'appName',
      message: _common2.default.messages.appName,
      when: () => !this.inputProps.appName,
      default: this.options.appname
    }, {
      type: 'list',
      name: 'reactExtension',
      message: _common2.default.messages.reactExtension,
      choices: _common2.default.reactExtensions,
      when: () => !this.inputProps.reactExtension,
      default: _common2.default.getDefaultChoiceIndex(_common2.default.reactExtensions, this.options.reactextension)
    }, {
      type: 'list',
      name: 'packageManager',
      message: _common2.default.messages.packageManager,
      choices: _common2.default.packageManagers,
      when: () => !this.inputProps.packageManager,
      default: _common2.default.getDefaultChoiceIndex(_common2.default.packageManagers, this.options.packagemanager)
    }];

    return this.prompt(questions).then(answers => {
      const appName = this.inputProps.appName || answers.appName;
      this.props = {
        reactExtension: this.inputProps.reactExtension || answers.reactExtension,
        appName: appName,
        appSubPath: this._filterPackageName(appName),
        packageManager: this.inputProps.packageManager || answers.packageManager
      };
    });
  }

  configuring() {
    if (!this._canConfigure()) {
      return;
    }
    this.destinationRoot(this.destinationPath(this.props.appSubPath));
    this._dispatch({
      type: 'SET_IS_VULCAN'
    });
    this._dispatch({
      type: 'SET_APP_NAME',
      appName: this.props.appName
    });
    this._dispatch({
      type: 'SET_REACT_EXTENSION',
      reactExtension: this.props.reactExtension
    });
    this._dispatch({
      type: 'SET_PACKAGE_MANAGER',
      packageManager: this.props.packageManager
    });
    this._commitStore();
  }

  install() {
    if (!this._canInstall()) {
      return;
    }
    this.log(_chalk2.default.green('\nPulling the most up to date git repository... \n'));
    this.spawnCommandSync('git', ['init']);
    this.spawnCommandSync('git', ['remote', 'add', 'origin', 'git@github.com:VulcanJS/Vulcan.git']);
    this.spawnCommandSync('git', ['pull', 'origin', 'master']);
    this.spawnCommandSync('git', ['remote', 'rm', 'origin']);
    this.installDependencies({
      npm: this.props.packageManager === 'npm',
      bower: false,
      yarn: this.props.packageManager === 'yarn'
    });
  }

  end() {
    if (!this._hasNoErrors()) {
      return this._end();
    }
    this.log(' ');
    this.log(_chalk2.default.green('Successfully generated vulcan code base. \n'));
    this.log(_chalk2.default.green('To run your new app: \n'));
    this.log(_chalk2.default.green(`  cd ${this.props.appSubPath}`));
    this.log(_chalk2.default.green(`  ${this.props.packageManager} start \n`));
  }
};
;
