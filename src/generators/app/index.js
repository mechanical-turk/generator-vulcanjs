const chalk = require('chalk');
const common = require('../../lib/common');
const VulcanGenerator = require('../../lib/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  _registerArguments () {
    this.option(
      'appname',
      {
        type: String,
        required: false,
        alias: 'n',
        desc: common.descriptions.appName,
      }
    );
    this.option(
      'reactextension',
      {
        type: String,
        required: false,
        alias: 'rx',
        desc: common.descriptions.reactExtension,
      }
    );
    this.option(
      'packagemanager',
      {
        type: String,
        required: false,
        alias: 'pm',
        desc: common.descriptions.packageManager,
      }
    );
  }

  initializing () {
    this._assertIsNotVulcan();
    this.inputProps = {};
  }

  prompting () {
    if (!this._canPrompt()) { return false; }
    const questions = [
      {
        type: 'input',
        name: 'appName',
        message: common.messages.appName,
        when: () => (!this.inputProps.appName),
        default: this.options.appname,
      },
      {
        type: 'list',
        name: 'reactExtension',
        message: common.messages.reactExtension,
        choices: common.reactExtensions,
        when: () => (!this.inputProps.reactExtension),
        default: common.getDefaultChoiceIndex(
          common.reactExtensions,
          this.options.reactextension
        ),
      },
      {
        type: 'list',
        name: 'packageManager',
        message: common.messages.packageManager,
        choices: common.packageManagers,
        when: () => (!this.inputProps.packageManager),
        default: common.getDefaultChoiceIndex(
          common.packageManagers,
          this.options.packagemanager
        ),
      },
    ];

    return this.prompt(questions).then((answers) => {
      const appName = this.inputProps.appName || answers.appName;
      this.props = {
        appName,
        reactExtension: (
          this.inputProps.reactExtension ||
          answers.reactExtension
        ),
        appSubPath: this._filterPackageName(appName),
        packageManager: this.inputProps.packageManager || answers.packageManager,
      };
    });
  }

  configuring () {
    if (!this._canConfigure()) { return; }
    this.destinationRoot(
      this.destinationPath(this.props.appSubPath)
    );
    this._dispatch({
      type: 'SET_IS_VULCAN',
    });
    this._dispatch({
      type: 'SET_APP_NAME',
      appName: this.props.appName,
    });
    this._dispatch({
      type: 'SET_REACT_EXTENSION',
      reactExtension: this.props.reactExtension,
    });
    this._dispatch({
      type: 'SET_PACKAGE_MANAGER',
      packageManager: this.props.packageManager,
    });
    this._commitStore();
  }

  install () {
    if (!this._canInstall()) { return; }
    this.log(chalk.green('\nPulling the most up to date git repository... \n'));
    this.spawnCommandSync('git', [
      'init',
    ]);
    this.spawnCommandSync('git', [
      'remote',
      'add',
      'origin',
      'git@github.com:VulcanJS/Vulcan.git',
    ]);
    this.spawnCommandSync('git', [
      'pull',
      'origin',
      'master',
    ]);
    this.spawnCommandSync('git', [
      'remote',
      'rm',
      'origin',
    ]);
    this.installDependencies({
      npm: this.props.packageManager === 'npm',
      bower: false,
      yarn: this.props.packageManager === 'yarn',
    });
  }

  end () {
    this._end();
    if (!this._hasNoErrors()) { return; }
    this.log(' ');
    this.log(chalk.green('Successfully generated vulcan code base. \n'));
    this.log(chalk.green('To run your new app: \n'));
    this.log(chalk.green(`  cd ${this.props.appSubPath}`));
    this.log(chalk.green(`  ${this.props.packageManager} start \n`));
  }
};
