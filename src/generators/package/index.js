const chalk = require('chalk');
const VulcanGenerator = require('../../lib/VulcanGenerator');
const ast = require('../../lib/ast');

module.exports = class extends VulcanGenerator {

  initializing () {
    this._assert('isVulcan');
  }

  _registerArguments () {
    this._registerPackageNameOption();
  }

  prompting () {
    if (!this._canPrompt()) { return false; }
    const questions = [
      this._getQuestion('packageName'),
      this._getQuestion('vulcanDependencies'),
      // this._getQuestion('isPackageAutoAdd'),
    ];

    return this.prompt(questions).then((answers) => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        vulcanDependencies: this._finalize('vulcanDependencies', answers),
        isPackageAutoAdd: this._finalize('raw', 'isPackageAutoAdd', answers),
      };
      this._assert('notPackageExists', this.props.packageName);
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
      this._getPath(
        'package',
        { isAbsolute: true },
        'package.js'
      ),
      this.props
    );
  }

  _writeClientMain () {
    this.fs.copyTpl(
      this.templatePath('client.js'),
      this._getPath(
        'client',
        { isAbsolute: true },
        'main.js'
      ),
      this.props
    );
  }

  _writeServerMain () {
    this.fs.copyTpl(
      this.templatePath('server.js'),
      this._getPath(
        'server',
        { isAbsolute: true },
        'main.js'
      ),
      this.props
    );
  }

  _writeServerSeed () {
    this.fs.copyTpl(
      this.templatePath('seed.js'),
      this._getPath(
        'server',
        { isAbsolute: true },
        'seed.js'
      ),
      this.props
    );
  }

  _writeModulesIndex () {
    this.fs.copyTpl(
      this.templatePath('module.js'),
      this._getPath(
        'modules',
        { isAbsolute: true },
        'index.js'
      ),
      this.props
    );
  }

  _writeRoutes () {
    this.fs.copyTpl(
      this.templatePath('routes.js'),
      this._getPath(
        'modules',
        { isAbsolute: true },
        'routes.js'
      ),
      this.props
    );
  }

  _writeStoriesJs () {
    this.fs.copyTpl(
      this.templatePath('stories.js'),
      this._getPath(
        'packageStories',
        { isAbsolute: true }
      ),
      this.props
    );
  }

  _updateRootStoriesIndex () {
    const rootStoriesIndexPath = this._getPath(
      'rootStories',
      { isAbsolute: true },
      'index.js'
    );
    if (!this.fs.exists(rootStoriesIndexPath)) { return; }
    const packageStoriesPath = this._getPath(
      'packageStories',
      {
        relativeTo: this._getPath(
          'rootStories',
          { isAbsolute: true }
        ),
      }
    );
    const fileText = this.fs.read(rootStoriesIndexPath);
    const importStatement = `import '${packageStoriesPath}';`;
    const fileTextWithWithImport = ast.addImportStatementAndParse(fileText, importStatement);
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
    // this._writeStoriesJs();
    // this._updateRootStoriesIndex();
  }

  end () {
    this._end();
    if (!this._hasNoErrors()) { return; }
    this.log(`\nTo activate your package, run: ${chalk.green(`meteor add ${this.props.packageName}`)}`);
  }
};
