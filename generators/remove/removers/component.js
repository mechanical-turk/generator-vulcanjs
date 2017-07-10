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
    const questions = this._getQuestions('packageNameWithNumModulesList', 'moduleNameList', 'componentName');
    return this.prompt(questions).then(answers => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        moduleName: this._finalize('moduleName', answers),
        componentPath: this._finalize('componentPath', answers)
      };
    });
  }

  writing() {
    if (!this._canWrite()) {
      return false;
    }
    this.fs.delete(this.props.componentPath);
    return true;
  }

  end() {
    this._end();
  }
};
