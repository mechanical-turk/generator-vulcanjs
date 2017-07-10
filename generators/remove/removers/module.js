const VulcanGenerator = require('../../../lib/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
  }

  _registerArguments() {
    //TODO: add arguments for remove
  }

  prompting() {
    if (!this._canPrompt()) {
      return false;
    }
    const questions = this._getQuestions('packageNameWithNumModulesList', 'moduleNameList');
    return this.prompt(questions).then(answers => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        moduleName: this._finalize('moduleName', answers)
      };
    });
  }

  writing() {
    if (!this._canWrite()) {
      return false;
    }
    const sourceDir = this._getPath({ isAbsolute: true }, 'module');
    this.fs.delete(sourceDir);
    this._dispatch({
      type: 'REMOVE_MODULE',
      packageName: this.props.packageName,
      moduleName: this.props.moduleName
    });
    return this._commitStore();
  }

  end() {
    this._end();
  }
};
