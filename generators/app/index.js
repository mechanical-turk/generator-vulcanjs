const chalk = require('chalk');
const VulcanGenerator = require('../../lib/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  _registerArguments() {
    this._registerAppNameOption();
    this._registerReactExtensionOption();
    this._registerPackageManagerOption();
  }

  initializing() {
    this._assertIsNotVulcan();
    this.inputProps = {};
  }

  prompting() {
    if (!this._canPrompt()) {
      return false;
    }
    const questions = [this._getQuestion('appName'), this._getQuestion('reactExtension'), this._getQuestion('packageManager')];

    return this.prompt(questions).then(answers => {
      this.props = {
        appName: this._finalize('appName', answers),
        reactExtension: this._finalize('raw', 'reactExtension', answers),
        packageManager: this._finalize('raw', 'packageManager', answers)
      };
    });
  }

  configuring() {
    if (!this._canConfigure()) {
      return;
    }
    this.destinationRoot(this.destinationPath(this.props.appName));
    this._dispatch({
      type: 'SET_IS_VULCAN_TRUE'
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
    this.log(chalk.green('\nPulling the most up to date git repository... \n'));
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
    this._end();
    if (!this._hasNoErrors()) {
      return;
    }
    this.log(' ');
    this.log(chalk.green('Successfully generated vulcan code base. \n'));
    this.log(chalk.green('To run your new app: \n'));
    this.log(chalk.green(`  cd ${this.props.appName}`));
    this.log(chalk.green(`  ${this.props.packageManager} start \n`));
  }
};
