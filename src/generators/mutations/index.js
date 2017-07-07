const VulcanGenerator = require('../../lib/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing () {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
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
        collectionName: this._finalize('collectionName', answers),
        newMutationName: this._finalize('mutationName', 'new', answers),
        editMutationName: this._finalize('mutationName', 'edit', answers),
        removeMutationName: this._finalize('mutationName', 'remove', answers),
        newPermission: this._finalize('mutationName', ['new'], answers),
        editOwnPermission: this._finalize('mutationName', ['edit', 'own'], answers),
        editAllPermission: this._finalize('mutationName', ['edit', 'all'], answers),
        removeOwnPermission: this._finalize('mutationName', ['remove', 'own'], answers),
        removeAllPermission: this._finalize('mutationName', ['remove', 'all'], answers),
      };

      this._assert('isPackageExists', this.props.packageName);
      this._assert('isModuleExists', this.props.packageName, this.props.moduleName);
    });
  }

  _writeMutations () {
    this.fs.copyTpl(
      this.templatePath('mutations.js'),
      this._getPath(
        { isAbsolute: true },
        'module',
        'mutations.js'
      ),
      this.props
    );
  }

  _writeTestMutations () {
    const testProps = {
      ...this.props,
      subjectName: 'mutations',
      subjectPath: '../mutations',
    };
    this.fs.copyTpl(
      this.templatePath('test.js'),
      this._getPath(
        { isAbsolute: true },
        'moduleTest',
        'mutations.js'
      ),
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
    this._writeMutations();
    this._writeTestMutations();
    // this._updateModuleIndex();
  }

  end () {
    this._end();
  }
};
