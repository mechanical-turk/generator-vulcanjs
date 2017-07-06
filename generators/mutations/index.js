var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const VulcanGenerator = require('../../lib/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._assertIsVulcan();
    this._assertHasNonZeroPackages();
    this.inputProps = {};
  }

  _registerArguments() {
    this._registerPackageNameOption();
    this._registerModuleNameOption();
  }

  prompting() {
    if (!this._canPrompt()) {
      return false;
    }
    const questions = [this._getPackageNameListQuestion(), this._getModuleNameListQuestion()];
    return this.prompt(questions).then(answers => {
      this.props = {
        packageName: this._getFinalPackageName(answers),
        moduleName: this._getFinalModuleName(answers),
        collectionName: this._getFinalCollectionName(answers),
        newMutationName: this._getFinalMutationName(answers, 'New'),
        editMutationName: this._getFinalMutationName(answers, 'Edit'),
        removeMutationName: this._getFinalMutationName(answers, 'Remove'),
        newPermission: this._getFinalPermissionName(answers, ['new']),
        editOwnPermission: this._getFinalPermissionName(answers, ['edit', 'own']),
        editAllPermission: this._getFinalPermissionName(answers, ['edit', 'all']),
        removeOwnPermission: this._getFinalPermissionName(answers, ['remove', 'own']),
        removeAllPermission: this._getFinalPermissionName(answers, ['remove', 'all'])
      };

      this._assertIsPackageExists(this.props.packageName);
      this._assertIsModuleExists(this.props.packageName, this.props.moduleName);
    });
  }

  _writeMutations() {
    this.fs.copyTpl(this.templatePath('mutations.js'), this._getModulePath({ isAbsolute: true }, 'mutations.js'), this.props);
  }

  _writeTestMutations() {
    const testProps = _extends({}, this.props, {
      subjectName: 'mutations',
      subjectPath: '../mutations'
    });
    this.fs.copyTpl(this.templatePath('test.js'), this._getModuleTestPath({ isAbsolute: true }, 'mutations.js'), testProps);
  }

  _updateModuleIndex() {
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

  writing() {
    if (!this._canWrite()) {
      return;
    }
    this._writeMutations();
    this._writeTestMutations();
    // this._updateModuleIndex();
  }

  end() {
    this._end();
  }
};
