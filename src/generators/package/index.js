const chalk = require('chalk');
const path = require('path');
const VulcanGenerator = require('../../lib/VulcanGenerator');
const common = require('../../lib/common');

module.exports = class extends VulcanGenerator {

  initializing () {
    this._assertIsVulcan();
    this.inputProps = {};
  }

  prompting () {
    if (!this._canPrompt()) { return false; }
    const questions = [
      this._getPackageNameInputQuestion(),
      {
        type: 'checkbox',
        name: 'vulcanDependencies',
        message: common.messages.vulcanDependencies,
        choices: [
          { name: 'vulcan:core', checked: true },
          'vulcan:posts',
          'vulcan:comments',
          'vulcan:newsletter',
          'vulcan:notifications',
          'vulcan:getting-started',
          'vulcan:categories',
          'vulcan:voting',
          'vulcan:embedly',
          'vulcan:api',
          'vulcan:rss',
          'vulcan:subscribe',
        ],
        when: () => (!this.inputProps.vulcanDependencies),
      },
      // this._getIsPackageAutoAddQuestion(),
    ];

    return this.prompt(questions).then((answers) => {
      const preProcessedDeps =
        this.inputProps.vulcanDependencies ||
        answers.vulcanDependencies;
      this.props = {
        packageName: this._filterPackageName(this.inputProps.packageName || answers.packageName),
        vulcanDependencies: preProcessedDeps.map((dep) => (`'${dep}'`)),
        isPackageAutoAdd: this.inputProps.isPackageAutoAdd || answers.isPackageAutoAdd,
      };
      this._assertNotPackageExists(this.props.packageName);
    });
  }

  configuring () {
    if (!this._canConfigure()) { return; }
    this._dispatch({
      type: 'ADD_PACKAGE',
      packageName: this.props.packageName,
    });
    this._commitStore();
  }

  _writePackageJs () {
    this.fs.copyTpl(
      this.templatePath('package.js'),
      this._getPackagePath('package.js'),
      this.props
    );
  }

  _writeClientMain () {
    this.fs.copyTpl(
      this.templatePath('client.js'),
      this._getClientPath('main.js'),
      this.props
    );
  }

  _writeServerMain () {
    this.fs.copyTpl(
      this.templatePath('server.js'),
      this._getServerPath('main.js'),
      this.props
    );
  }

  _writeServerSeed () {
    this.fs.copyTpl(
      this.templatePath('seed.js'),
      this._getServerPath('seed.js'),
      this.props
    );
  }

  _writeModulesIndex () {
    this.fs.copyTpl(
      this.templatePath('module.js'),
      this._getModulesPath('index.js'),
      this.props
    );
  }

  _writeRoutes () {
    this.fs.copyTpl(
      this.templatePath('routes.js'),
      this._getModulesPath('routes.js'),
      this.props
    );
  }

  _writeStoriesJs () {
    this.fs.copyTpl(
      this.templatePath('stories.js'),
      this._getComponentsPath('stories.js'),
      this.props
    );
  }

  writing () {
    if (!this._canWrite()) { return; }
    this._writePackageJs();
    this._writeClientMain();
    this._writeServerMain();
    this._writeServerSeed();
    this._writeModulesIndex();
    this._writeRoutes();
    // this._writeStoriesJs();
  }

  end () {
    this._end();
    if (!this._hasNoErrors()) { return; }
    this.log(`\nTo activate your package, run: ${chalk.green(`meteor add ${this.props.packageName}`)}`);
  }
};
