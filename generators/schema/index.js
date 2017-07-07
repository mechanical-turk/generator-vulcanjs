var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const VulcanGenerator = require('../../lib/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
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
    const questions = [this._getQuestion('packageNameList'), this._getQuestion('moduleNameList')];
    return this.prompt(questions).then(answers => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        moduleName: this._finalize('moduleName', answers)
      };
      this._assert('isPackageExists', this.props.packageName);
      this._assert('isModuleExists', this.props.packageName, this.props.moduleName);
    });
  }

  _writeSchema() {
    this.fs.copyTpl(this.templatePath('schema.js'), this._getPath('module', { isAbsolute: true }, 'schema.js'), this.props);
  }

  _writeTestSchema() {
    const testFragmentsProps = _extends({}, this.props, {
      subjectName: 'schema',
      subjectPath: '../schema'
    });
    this.fs.copyTpl(this.templatePath('test.js'), this._getPath('moduleTest', { isAbsolute: true }, 'schema.js'), testFragmentsProps);
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
    this._writeSchema();
    this._writeTestSchema();
    // this._updateModuleIndex();
  }

  end() {
    this._end();
  }
};
