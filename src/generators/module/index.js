const pascalCase = require('pascal-case');
const camelCase = require('camelcase');
const VulcanGenerator = require('../../lib/VulcanGenerator');
const ast = require('../../lib/ast');

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
      this._getPackageNameListQuestion(),
      this._getModuleNameInputQuestion(),
      this._getModuleCreateWithQuestion(),
    ];

    return this.prompt(questions)
    .then((answers) => {
      const packageName = this._filterPackageName(
        this.inputProps.packageName ||
        answers.packageName
      );
      const moduleName = this._filterModuleName(this.inputProps.moduleName || answers.moduleName);
      const camelModuleName = camelCase(moduleName);
      const pascalModuleName = pascalCase(moduleName);
      this.props = {
        packageName,
        moduleName,
        collectionName: pascalModuleName,
        typeName: pascalModuleName,
        moduleParts: this.inputProps.moduleParts || answers.moduleParts,
      };

      this._assertIsPackageExists(this.props.packageName);
      this._assertNotModuleExists(this.props.packageName, this.props.moduleName);
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
      this._getModulePath({ isAbsolute: true }, 'collection.js'),
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
      this._getModuleTestPath({ isAbsolute: true }, 'collection.js'),
      testProps
    );
  }

  _writeStories () {
    this.fs.copyTpl(
      this.templatePath('stories.js'),
      this._getModuleStoriesPath({ isAbsolute: true }),
      this.props
    );
  }

  _updateModulesIndex () {
    const modulePath = this._getModulesPath({ isAbsolute: true }, 'index.js');
    const fileText = this.fs.read(modulePath);
    const fileWithImportText = ast.addImportStatementAndParse(
      fileText,
      `import './${this.props.moduleName}/collection.js';`
    );
    this.fs.write(
      modulePath,
      fileWithImportText
    );
  }

  _updatePackageStories () {
    const packageStoriesPath = this._getPackageStoriesPath({
      isAbsolute: true,
    });
    const fileText = this.fs.read(packageStoriesPath);
    const fileWithImportText = ast.addImportStatementAndParse(
      fileText,
      `import './${this.props.moduleName}/.stories.js';`
    );
    this.fs.write(
      packageStoriesPath,
      fileWithImportText
    );
  }

  writing () {
    if (!this._canWrite()) { return; }
    this._writeCollection();
    // this._writeStories();
    this._updateModulesIndex();
    // this._updatePackageStories();
    this._writeTestCollection();
  }

  end () {
    this._end();
  }
};
