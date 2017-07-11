const VulcanGenerator = require('../../lib/VulcanGenerator');
const ast = require('../../lib/ast');
const common = require('../../lib/common');

module.exports = class extends VulcanGenerator {
  initializing () {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
  }

  _registerArguments () {
    this._registerOptions(
      'packageName',
      'moduleName' 
    );
  }

  prompting () {
    if (!this._canPrompt()) { return false; }
    const questions = this._getQuestions(
      'packageNameList',
      'moduleName'
    );
    return this.prompt(questions)
    .then((answers) => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        moduleName: this._finalize('moduleName', answers),
        collectionName: this._finalize('collectionName', answers),
        typeName: this._finalize('pascalModuleName', answers),
      };
      this._composeGenerators();
    });
  }

  _composeGenerators () {
    common.modelParts.forEach((modulePart) => {
      const generator = require.resolve(`./${modulePart}`);
      const nextOptions = {
        ...this.options,
        ...this.props,
        dontAsk: true,
      };
      this.composeWith(generator, nextOptions);
    });
  }

  configuring () {
    if (!this._canConfigure()) { return; }
    this._dispatch({
      type: 'ADD_MODULE',
      packageName: this.props.packageName,
      moduleName: this.props.moduleName,
    });
    this._commitStore();
  }

  _writeCollection () {
    this.fs.copyTpl(
      this.templatePath('collection.js'),
      this._getPath(
        { isAbsolute: true },
        'module',
        'collection.js'
      ),
      this.props
    );
  }

  _writeTestCollection () {
    const testProps = {
      ...this.props,
      subjectName: 'collection',
      subjectPath: '../collection',
    };
    this.fs.copyTpl(
      this.templatePath('tests/collection.js'),
      this._getPath(
        { isAbsolute: true },
        'moduleTest',
        'collection.js'
      ),
      testProps
    );
  }

  _updateModulesIndex () {
    const modulePath = this._getPath(
      { isAbsolute: true },
      'modules',
      'index.js'
    );
    const fileText = this.fs.read(modulePath);
    const fileWithImportText = ast.addImportStatement(
      fileText,
      `import './${this.props.moduleName}/collection.js';`
    );
    this.fs.write(
      modulePath,
      fileWithImportText
    );
  }

  writing () {
    if (!this._canWrite()) { return; }
    this._writeCollection();
    this._updateModulesIndex();
    this._writeTestCollection();
  }

  end () {
    this._end();
  }
};
