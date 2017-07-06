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
      this._getPackageNameListQuestion(),
      this._getModuleNameListQuestion(),
      this._getDefaultResolversQuestion(),
    ];
    return this.prompt(questions)
    .then((answers) => {
      const camelModuleName = this._getFinalCamelModuleName(answers);
      const defaultResolvers = this._getFinalDefaultResolvers(answers);
      this.props = {
        packageName: this._getFinalPackageName(answers),
        moduleName: this._getFinalModuleName(answers),
        collectionName: this._getFinalCollectionName(answers),
        listResolverName: `${camelModuleName}List`,
        singleResolverName: `${camelModuleName}Single`,
        totalResolverName: `${camelModuleName}Total`,
        hasListResolver: defaultResolvers.list,
        hasSingleResolver: defaultResolvers.single,
        hasTotalResolver: defaultResolvers.total,
      };

      console.log(this.props);

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
