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
    ];
    return this.prompt(questions)
    .then((answers) => {
      this.props = {
        packageName: this._getFinalPackageName(answers),
        moduleName: this._getFinalModuleName(answers),
        typeName: this._getFinalPascalModuleName(answers),
      };

      this._assertIsPackageExists(this.props.packageName);
      this._assertIsModuleExists(this.props.packageName, this.props.moduleName);
    });
  }

  _writeFragments () {
    this.fs.copyTpl(
      this.templatePath('fragments.js'),
      this._getModulePath({ isAbsolute: true }, 'fragments.js'),
      this.props
    );
  }

  _writeTestFragments () {
    const testCollectionProps = {
      ...this.props,
      subjectName: 'fragments',
      subjectPath: '../fragments',
    };
    this.fs.copyTpl(
      this.templatePath('test.js'),
      this._getModuleTestPath({ isAbsolute: true }, 'fragments.js'),
      testCollectionProps
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
    this._writeFragments();
    this._writeTestFragments();
    // this._updateModuleIndex();
  }

  end () {
    this._end();
  }
};
