const Generator = require('yeoman-generator');
const path = require('path');
const VulcanGenerator = require('../../libs/VulcanGenerator');
const dashify = require('dashify');

module.exports = class extends VulcanGenerator {

  prompting() {
    if (!this._canPrompt()) { return; }
    this.inputProps = {};
    const questions = [
      {
        type: 'input',
        name: 'packageName',
        message: 'Package name',
        when: () => (!this.inputProps.packageName),
      },
      {
        type: 'checkbox',
        name: 'vulcanDependencies',
        message: 'Vulcan dependencies',
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
        packageName: dashify(this.inputProps.packageName || answers.packageName),
        vulcanDependencies: (
          this.inputProps.vulcanDependencies ||
          answers.vulcanDependencies
        ),
      };
    });
  }

  _getPackagePath() {
    return path.join('packages', this.props.packageName);
  }

  configuring() {
    if (!this._canConfigure()) { return; }
    this.originalRoot = this.destinationRoot();
    this.destinationRoot(
      this.destinationPath(
        this._getPackagePath()
      )
    );
    this.config.set('packageName', this.props.packageName);
    this.destinationRoot(this.originalRoot);
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
