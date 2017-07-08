const VulcanGenerator = require('../../lib/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing () {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
  }

  _registerArguments () {
    this._registerPackageNameOption();
    this._registerModuleNameOption();
  }

  prompting () {
    if (!this._canPrompt()) { return false; }
    const questions = [
      this._getQuestion('packageNameWithNumModulesList'),
      this._getQuestion('moduleNameList'),
    ];
    return this.prompt(questions)
    .then((answers) => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        moduleName: this._finalize('moduleName', answers),
        parametersName: this._finalize('moduleName', answers),
      };

      this._assert('isPackageExists', this.props.packageName);
      this._assert('isModuleExists', this.props.packageName, this.props.moduleName);
    });
  }

  _writeParameters () {
    this.fs.copyTpl(
      this.templatePath('parameters.js'),
      this._getPath(
        { isAbsolute: true },
        'module',
        'parameters.js'
      ),
      this.props
    );
  }

  _writeTestParameters () {
    const testFragmentsProps = {
      ...this.props,
      subjectName: 'parameters',
      subjectPath: '../parameters',
    };
    this.fs.copyTpl(
      this.templatePath('test.js'),
      this._getPath(
        { isAbsolute: true },
        'moduleTest',
        'parameters.js'
      ),
      testFragmentsProps
    );
  }

  writing () {
    if (!this._canWrite()) { return; }
    this._writeParameters();
    this._writeTestParameters();
  }

  end () {
    this._end();
  }
};
