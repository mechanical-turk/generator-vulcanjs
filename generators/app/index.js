const Generator = require('yeoman-generator');
const chalk = require('chalk');
const dashify = require('dashify');
const common = require('../../libs/common');
const VulcanGenerator = require('../../libs/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._checkNotVulcan();
    // console.log(this.errors);
  }

  prompting() {
    if (!this._canPrompt()) { return; }
    // this.inputProps = {
    //   appName: 'kerem',
    //   reactExtension: 'jsx',
    // }
    this.inputProps = {};
    const questions = [];
    if (!this.inputProps.appName) {
      questions.push({
        type: 'input',
        name: 'appName',
        message: 'App name',
      });
    }

    if (!this.inputProps.reactExtension) {
      questions.push({
        type: 'list',
        name: 'reactExtension',
        message: 'Default react component extension',
        choices: [
          'jsx',
          'js',
        ],
      });
    }

    if (!this.inputProps.packageManager) {
      questions.push({
        type: 'list',
        name: 'packageManager',
        message: 'Preferred package manager',
        choices: [
          'yarn',
          'npm',
        ],
      });
    }

    return this.prompt(questions).then((answers) => {
      const appName = this.inputProps.appName || answers.appName;
      this.props = {
        reactExtension: (
          this.inputProps.reactExtension ||
          answers.reactExtension
        ),
        appName: appName,
        appSubPath: dashify(appName),
        packageManager: this.inputProps.packageManager || answers.packageManager,
      };
    });
  }

  configuring() {
    if (!this._canConfigure()) { return; }
    this.destinationRoot(
      this.destinationPath(this.props.appSubPath)
    );
    this.config.set('appName', this.props.appName);
    this.config.set('reactExtension', this.props.reactExtension);
    this.config.set('isVulcan', true);
    this.config.set('packageManager', this.props.packageManager);
  }

  install() {
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

  end() {
    if (!this._hasNoErrors()) { return this._end(); }
    this.log(' ');
    this.log(chalk.green('Successfully generated vulcan code base. \n'));
    this.log(chalk.green('To run your new app: \n'));
    this.log(chalk.green(`  cd ${this.props.appSubPath}`));
    this.log(chalk.green(`  ${this.props.packageManager} start \n`));
  }
};
