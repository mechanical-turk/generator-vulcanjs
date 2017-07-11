var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const VulcanGenerator = require('../../lib/VulcanGenerator');
const ast = require('../../lib/ast');
const common = require('../../lib/common');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
  }

  _registerArguments() {
    this._registerOptions('packageName', 'modelName');
  }

  prompting() {
    if (!this._canPrompt()) {
      return false;
    }
    const questions = this._getQuestions('packageNameList', 'modelName');
    return this.prompt(questions).then(answers => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        modelName: this._finalize('modelName', answers),
        collectionName: this._finalize('collectionName', answers),
        typeName: this._finalize('pascalModuleName', answers)
      };
      this._composeGenerators();
    });
  }

  _composeGenerators() {
    common.modelParts.forEach(modelPart => {
      const generator = require.resolve(`./${modelPart}`);
      const nextOptions = _extends({}, this.options, this.props, {
        dontAsk: true
      });
      this.composeWith(generator, nextOptions);
    });
  }

  configuring() {
    if (!this._canConfigure()) {
      return;
    }
    this._dispatch({
      type: 'ADD_MODULE',
      packageName: this.props.packageName,
      modelName: this.props.modelName
    });
    this._commitStore();
  }

  _writeCollection() {
    this.fs.copyTpl(this.templatePath('collection.js'), this._getPath({ isAbsolute: true }, 'model', 'collection.js'), this.props);
  }

  _writeTestCollection() {
    const testProps = _extends({}, this.props, {
      subjectName: 'collection',
      subjectPath: '../collection'
    });
    this.fs.copyTpl(this.templatePath('tests/collection.js'), this._getPath({ isAbsolute: true }, 'modelTest', 'collection.js'), testProps);
  }

  _updateModulesIndex() {
    const modelPath = this._getPath({ isAbsolute: true }, 'models', 'index.js');
    const fileText = this.fs.read(modelPath);
    const fileWithImportText = ast.addImportStatement(fileText, `import './${this.props.modelName}/collection.js';`);
    this.fs.write(modelPath, fileWithImportText);
  }

  writing() {
    if (!this._canWrite()) {
      return;
    }
    this._writeCollection();
    this._updateModulesIndex();
    this._writeTestCollection();
  }

  end() {
    this._end();
  }
};
