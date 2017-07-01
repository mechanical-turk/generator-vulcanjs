const Generator = require('yeoman-generator');
const beautify = require('gulp-beautify');
const chalk = require('chalk');
const dashify = require('dashify');

module.exports = class extends Generator {
  initializing() {
    this.registerTransformStream(beautify({indent_size: 2 }));
    // this.composeWith(require.resolve('../package'));
    // this.composeWith(require.resolve('../component'));
    // this.composeWith(require.resolve('../module'));
  }

  prompting() {
    this.inputProps = {
      appName: 'kerem',
      reactExtension: 'jsx',
    }
    // this.inputProps = {};
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
    return this.prompt(questions).then((answers) => {
      const appName = this.inputProps.appName || answers.appName;
      this.props = {
        reactExtension: (
          this.inputProps.reactExtension ||
          answers.reactExtension
        ),
        appName: appName,
        appSubPath: dashify(appName),
      };
    });
  }

  configuring() {
    this.destinationRoot(
      this.destinationPath(this.props.appSubPath)
    );
    this.config.set('appName', this.props.appName);
    this.config.set('reactExtension', this.props.reactExtension);
  }

  install() {
    this.log(chalk.blue('Pulling the most up to date git repository... \n'));
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
  }

  end() {
    this.log(' ');
    this.log(chalk.green('Successfully generated vulcan code base. \n'));
    this.log('To run your new app:')
    this.log(chalk.blue(`  cd ${this.props.appSubPath}`));
    this.log(chalk.blue('  meteor'));

  }
};
