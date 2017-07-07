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
    ];
    return this.prompt(questions)
    .then((answers) => {
      this.props = {
        packageName: this._getFinalPackageName(answers),
        moduleName: this._getFinalModuleName(answers),
        newPermission: this._getFinalPermissionName(answers, ['new']),
        editOwnPermission: this._getFinalPermissionName(answers, ['edit', 'own']),
        editAllPermission: this._getFinalPermissionName(answers, ['edit', 'all']),
        removeOwnPermission: this._getFinalPermissionName(answers, ['remove', 'own']),
        removeAllPermission: this._getFinalPermissionName(answers, ['remove', 'all']),
      };

      this._assertIsPackageExists(this.props.packageName);
      this._assertIsModuleExists(this.props.packageName, this.props.moduleName);
    });
  }

  _writePermissions () {
    this.fs.copyTpl(
      this.templatePath('permissions.js'),
      this._getModulePath({ isAbsolute: true }, 'permissions.js'),
      this.props
    );
  }

  _writeTestPermissions () {
    const testProps = {
      ...this.props,
      subjectName: 'permissions',
      subjectPath: '../permissions',
    };
    this.fs.copyTpl(
      this.templatePath('test.js'),
      this._getModuleTestPath({ isAbsolute: true }, 'permissions.js'),
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
    this._writePermissions();
    this._writeTestPermissions();
    // this._updateModuleIndex();
  }

  end () {
    this._end();
  }
};
