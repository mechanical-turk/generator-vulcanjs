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
        packageName: this._finalize('packageName', answers),
        moduleName: this._finalize('moduleName', answers),
        newPermission: this._finalize('permissionName', ['new'], answers),
        editOwnPermission: this._finalize('permissionName', ['edit', 'own'], answers),
        editAllPermission: this._finalize('permissionName', ['edit', 'all'], answers),
        removeOwnPermission: this._finalize('permissionName', ['remove', 'own'], answers),
        removeAllPermission: this._finalize('permissionName', ['remove', 'all'], answers),
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
