var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const VulcanGenerator = require('../../lib/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
  }

  _registerArguments() {
    this._registerOptions('packageName', 'moduleName');
  }

  prompting() {
    if (!this._canPrompt()) {
      return false;
    }
    const questions = this._getQuestions('packageNameWithNumModulesList', 'moduleNameList');
    return this.prompt(questions).then(answers => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        moduleName: this._finalize('moduleName', answers),
        typeName: this._finalize('pascalModuleName', answers)
      };
    });
  }

  _writeFragments() {
    this.fs.copyTpl(this.templatePath('fragments.js'), this._getPath({ isAbsolute: true }, 'module', 'fragments.js'), this.props);
  }

  _writeTestFragments() {
    const testProps = _extends({}, this.props, {
      subjectName: 'fragments',
      subjectPath: '../fragments'
    });
    this.fs.copyTpl(this.templatePath('test.js'), this._getPath({ isAbsolute: true }, 'moduleTest', 'fragments.js'), testProps);
  }

  writing() {
    if (!this._canWrite()) {
      return;
    }
    this._writeFragments();
    this._writeTestFragments();
  }

  end() {
    this._end();
  }
};