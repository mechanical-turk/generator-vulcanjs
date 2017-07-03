const Generator = require('yeoman-generator');
const path = require('path');
const VulcanGenerator = require('../../libs/VulcanGenerator');
const common = require('../../libs/common');

module.exports = class extends VulcanGenerator {

  _registerArguments() {

  }

  initializing() {
    this._assertIsVulcan();
    this.inputProps = {};
  }

  prompting() {
    if (!this._canPrompt()) { return; }
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
      }
    ];

    return this.prompt(questions).then((answers) => {
      this.props = {
        packageName: this._filterPackageName(this.inputProps.packageName || answers.packageName),
        vulcanDependencies: (
          this.inputProps.vulcanDependencies ||
          answers.vulcanDependencies
        ),
      };
      this._assertNotPackageExists(this.props.packageName);
    });
  }

  _getPackagePath() {
    return path.join('packages', this.props.packageName);
  }

  configuring() {
    if (!this._canConfigure()) { return; }
    this._dispatch({
      type: 'ADD_PACKAGE',
      packageName: this.props.packageName,
    });
    this._commitStore();
  }

  writing() {
    if (!this._canWrite()) { return; }
    this.fs.copyTpl(
      this.templatePath('package.js'),
      this.destinationPath(
        this._getPackagePath(),
        'package.js'
      ),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('client.js'),
      this.destinationPath(
        this._getPackagePath(),
        'lib',
        'client',
        'main.js'
      ),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('server.js'),
      this.destinationPath(
        this._getPackagePath(),
        'lib',
        'server',
        'main.js'
      ),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('seed.js'),
      this.destinationPath(
        this._getPackagePath(),
        'lib',
        'server',
        'seed.js'
      ),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('module.js'),
      this.destinationPath(
        this._getPackagePath(),
        'lib',
        'modules',
        'index.js'
      ),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('routes.js'),
      this.destinationPath(
        this._getPackagePath(),
        'lib',
        'modules',
        'routes.js'
      ),
      this.props
    );
  }

  end() {
    this._end();
  }
};
