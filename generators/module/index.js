var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const pascalCase = require('pascal-case');
const camelCase = require('camelcase');
const VulcanGenerator = require('../../lib/VulcanGenerator');
const ast = require('../../lib/ast');

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
    const questions = [this._getPackageNameListQuestion(), this._getModuleNameInputQuestion(), this._getModuleCreateWithQuestion()];

    return this.prompt(questions).then(answers => {
      const packageName = this._filterPackageName(this.inputProps.packageName || answers.packageName);
      const moduleName = this._filterModuleName(this.inputProps.moduleName || answers.moduleName);
      const camelModuleName = camelCase(moduleName);
      const pascalModuleName = pascalCase(moduleName);
      this.props = {
        packageName: packageName,
        moduleName: moduleName,
        collectionName: pascalModuleName,
        typeName: pascalModuleName,
        newMutationName: `${camelModuleName}New`,
        newPermission: `${camelModuleName}.new`,
        editMutationName: `${camelModuleName}Edit`,
        editOwnPermission: `${camelModuleName}.edit.own`,
        editAllPermission: `${camelModuleName}.edit.all`,
        removeMutationName: `${camelModuleName}Remove`,
        removeOwnPermission: `${camelModuleName}.remove.own`,
        removeAllPermission: `${camelModuleName}.remove.all`,
        parametersName: `${camelModuleName}.parameters`,
        moduleParts: this.inputProps.moduleParts || answers.moduleParts
      };

      this._assertIsPackageExists(this.props.packageName);
      this._assertNotModuleExists(this.props.packageName, this.props.moduleName);
    });
  }

  configuring() {
    if (!this._canConfigure()) {
      return;
    }
    this._dispatch({
      type: 'ADD_MODULE',
      packageName: this.props.packageName,
      moduleName: this.props.moduleName
    });
    this._commitStore();
  }

  _writeMutations() {
    if (!this.props.moduleParts.mutations) {
      return;
    }
    this.fs.copyTpl(this.templatePath('mutations.js'), this._getModulePath({ isAbsolute: true }, 'mutations.js'), this.props);
  }

  _writeTestMutations() {
    const testProps = _extends({}, this.props, {
      subjectName: 'mutations',
      subjectPath: '../mutations'
    });
    this.fs.copyTpl(this.templatePath('tests/generic.js'), this._getModuleTestPath({ isAbsolute: true }, 'mutations.js'), testProps);
  }

  _writeParameters() {
    if (!this.props.moduleParts.parameters) {
      return;
    }
    this.fs.copyTpl(this.templatePath('parameters.js'), this._getModulePath({ isAbsolute: true }, 'parameters.js'), this.props);
  }

  _writeTestParameters() {
    const testProps = _extends({}, this.props, {
      subjectName: 'parameters',
      subjectPath: '../parameters'
    });
    this.fs.copyTpl(this.templatePath('tests/generic.js'), this._getModuleTestPath({ isAbsolute: true }, 'parameters.js'), testProps);
  }

  _writePermissions() {
    if (!this.props.moduleParts.permissions) {
      return;
    }
    this.fs.copyTpl(this.templatePath('permissions.js'), this._getModulePath({ isAbsolute: true }, 'permissions.js'), this.props);
  }

  _writeTestPermissions() {
    const testProps = _extends({}, this.props, {
      subjectName: 'permissions',
      subjectPath: '../permissions'
    });
    this.fs.copyTpl(this.templatePath('tests/generic.js'), this._getModuleTestPath({ isAbsolute: true }, 'permissions.js'), testProps);
  }

  _writeSchema() {
    if (!this.props.moduleParts.schema) {
      return;
    }
    this.fs.copyTpl(this.templatePath('schema.js'), this._getModulePath({ isAbsolute: true }, 'schema.js'), this.props);
  }

  _writeTestSchema() {
    const testProps = _extends({}, this.props, {
      subjectName: 'schema',
      subjectPath: '../scjema'
    });
    this.fs.copyTpl(this.templatePath('tests/generic.js'), this._getModuleTestPath({ isAbsolute: true }, 'schema.js'), testProps);
  }

  _writeStories() {
    this.fs.copyTpl(this.templatePath('stories.js'), this._getModuleStoriesPath({ isAbsolute: true }), this.props);
  }

  _updateModulesIndex() {
    const modulePath = this._getModulesPath({ isAbsolute: true }, 'index.js');
    const fileText = this.fs.read(modulePath);
    const fileWithImportText = ast.addImportStatementAndParse(fileText, `import './${this.props.moduleName}/collection.js';`);
    this.fs.write(modulePath, fileWithImportText);
  }

  _updatePackageStories() {
    const packageStoriesPath = this._getPackageStoriesPath({
      isAbsolute: true
    });
    const fileText = this.fs.read(packageStoriesPath);
    const fileWithImportText = ast.addImportStatementAndParse(fileText, `import './${this.props.moduleName}/.stories.js';`);
    this.fs.write(packageStoriesPath, fileWithImportText);
  }

  _writeAllCode() {
    this._writeCollection();
    this._writeMutations();
    this._writeParameters();
    this._writePermissions();
    // this._writeStories();
  }

  _writeAllTests() {
    this._writeTestCollection();
    this._writeTestMutations();
    this._writeTestParameters();
    this._writeTestPermissions();
  }

  _updateAllCode() {
    this._updateModulesIndex();
    // this._updatePackageStories();
  }

  writing() {
    if (!this._canWrite()) {
      return;
    }
    this._writeAllCode();
    this._writeAllTests();
    this._updateAllCode();
  }

  end() {
    this._end();
  }
};
