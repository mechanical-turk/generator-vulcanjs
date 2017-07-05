const chalk = require('chalk');
const VulcanGenerator = require('../../lib/VulcanGenerator');
const common = require('../../lib/common');
const ast = require('../../lib/ast');

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
      this._getPackagePath({ isAbsolute: true }, 'package.js'),
      this.props
    );
  }

  _writeClientMain () {
    this.fs.copyTpl(
      this.templatePath('client.js'),
      this._getClientPath({ isAbsolute: true }, 'main.js'),
      this.props
    );
  }

  _writeServerMain () {
    this.fs.copyTpl(
      this.templatePath('server.js'),
      this._getServerPath({ isAbsolute: true }, 'main.js'),
      this.props
    );
  }

  _writeServerSeed () {
    this.fs.copyTpl(
      this.templatePath('seed.js'),
      this._getServerPath({ isAbsolute: true }, 'seed.js'),
      this.props
    );
  }

  _writeModulesIndex () {
    this.fs.copyTpl(
      this.templatePath('module.js'),
      this._getModulesPath({ isAbsolute: true }, 'index.js'),
      this.props
    );
  }

  _writeRoutes () {
    this.fs.copyTpl(
      this.templatePath('routes.js'),
      this._getModulesPath({ isAbsolute: true }, 'routes.js'),
      this.props
    );
  }

  _writeStoriesJs () {
    this.fs.copyTpl(
      this.templatePath('stories.js'),
      this._getPackageStoriesPath({ isAbsolute: true }),
      this.props
    );
  }

  _updateRootStoriesIndex () {
    const rootStoriesIndexPath = this._getRootStoriesPath(
      { isAbsolute: true },
      'index.js'
    );
    if (!this.fs.exists(rootStoriesIndexPath)) { return; }
    const packageStoriesPath = this._getPackageStoriesPath({
      relativeTo: this._getRootStoriesPath({
        isAbsolute: true,
      }),
    });
    const fileText = this.fs.read(rootStoriesIndexPath);
    const fileTextWithWithImport = ast.addImportStatementAndParse(fileText, `import '${packageStoriesPath}';`);
    this.fs.write(
      rootStoriesIndexPath,
      fileTextWithWithImport
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
    this._writeStoriesJs();
    this._updateRootStoriesIndex();
  }

  end () {
    this._end();
    if (!this._hasNoErrors()) { return; }
    this.log(`\nTo activate your package, run: ${chalk.green(`meteor add ${this.props.packageName}`)}`);
  }
};
