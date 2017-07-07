const VulcanGenerator = require('../../lib/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing () {
    this._assertIsVulcan();
    this._assertHasNonZeroPackages();
    this.inputProps = {};
  }

  _registerArguments () {
    this._registerPackageNameOption();
    this._registerModuleNameOption();
  }

  prompting () {
    if (!this._canPrompt()) { return false; }
    const questions = [
      this._getQuestion('packageNameList'),
      this._getQuestion('moduleNameList'),
      this._getQuestion('defaultResolvers'),
    ];
    return this.prompt(questions)
    .then((answers) => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        moduleName: this._finalize('moduleName', answers),
        collectionName: this._finalize('collectionName', answers),
        listResolverName: this._finalize('resolverName', 'List', answers),
        singleResolverName: this._finalize('resolverName', 'Single', answers),
        totalResolverName: this._finalize('resolverName', 'Total', answers),
        hasListResolver: this._finalize('hasResolver', 'list', answers),
        hasSingleResolver: this._finalize('hasResolver', 'single', answers),
        hasTotalResolver: this._finalize('hasResolver', 'total', answers),
      };
      this._assertIsPackageExists(this.props.packageName);
      this._assertIsModuleExists(this.props.packageName, this.props.moduleName);
    });
  }

  _writeResolvers () {
    this.fs.copyTpl(
      this.templatePath('resolvers.js'),
      this._getModulePath({ isAbsolute: true }, 'resolvers.js'),
      this.props
    );
  }

  _writeTestResolvers () {
    const testProps = {
      ...this.props,
      subjectName: 'resolvers',
      subjectPath: '../resolvers',
    };
    this.fs.copyTpl(
      this.templatePath('test.js'),
      this._getModuleTestPath({ isAbsolute: true }, 'resolvers.js'),
      testProps
    );
  }

  _updateModuleIndex () {
    // const modulePath = this._getModulesPath({ isAbsolute: true }, 'index.js');
    // const fileText = this.fs.read(modulePath);
    // const fileWithImportText = ast.addImportStatementAndParse(
    //   fileText,
    //   `import './${this.props.moduleName}/collection.js';`
    // );
    // this.fs.write(
    //   modulePath,
    //   fileWithImportText
    // );
  }

  writing () {
    if (!this._canWrite()) { return; }
    this._writeResolvers();
    this._writeTestResolvers();
    // this._updateModuleIndex();
  }

  end () {
    this._end();
  }
};
