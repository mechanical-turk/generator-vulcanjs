var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const pascalCase = require('pascal-case');
const chalk = require('chalk');
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
    this._registerComponentNameOption();
  }

  prompting() {
    if (!this._canPrompt()) {
      return false;
    }
    const firstQuestions = [
    // this._getStoryBookSetupQuestion(),
    this._getPackageNameListQuestion()];

    return this.prompt(firstQuestions).then(answers => {
      this.props = {
        packageName: this._filterPackageName(this.inputProps.packageName || answers.packageName),
        storyBookSetupStatus: this.inputProps.storyBookSetupStatus || answers.storyBookSetupStatus
      };
      this._assertPackageHasNonZeroModules(this.props.packageName);
      const secondQuestions = [this._getModuleNameListQuestion(), this._getComponentNameQuestion(), this._getComponentTypeQuestion(), this._getIsRegisterComponentQuestion()];
      if (this._packageHasNonZeroModules(this.props.packageName)) {
        return this.prompt(secondQuestions);
      }
      return Promise.reject('noModulesInPackage');
    }).then(answers => {
      this.props = _extends({}, this.props, {
        moduleName: this.inputProps.moduleName || answers.moduleName,
        componentName: pascalCase(this.inputProps.componentName || answers.componentName),
        componentType: this.inputProps.componentType || answers.componentType,
        isRegister: this.inputProps.isRegister || answers.isRegister,
        isAddComponentToStoryBook: this.inputProps.isAddComponentToStoryBook || answers.isAddComponentToStoryBook
      });
      this.props.componentPath = this._getComponentPath({
        isAbsolute: true
      });
      this.props.templatePath = this.props.componentType === 'pure' ? this.templatePath('pureFunctionComponent.js') : this.templatePath('classComponent.js');
      this._assertModuleIsExists(this.props.packageName, this.props.moduleName);
    }, () => {});
  }

  configuring() {
    if (!this._canConfigure()) {
      return;
    }
    if (this.props.storyBookSetupStatus) {
      this._dispatch({
        type: 'SET_STORYBOOK_SETUP_STATUS',
        status: this.props.storyBookSetupStatus
      });
    }
    this._commitStore();
    // this._installStorybook();
  }

  _canInstall() {
    return super._canInstall() && this._getStoryBookSetupStatus() === 'installing';
  }

  _installStorybook() {
    if (!this._canInstall()) {
      return;
    }
    this.log(chalk.green('\nTaking you to react storybook setup... \n'));
    this.spawnCommandSync('getstorybook');
    this._dispatch({
      type: 'SET_STORYBOOK_SETUP_STATUS',
      status: 'installed'
    });
    this._commitStore();
  }

  _writeComponent() {
    this.fs.copyTpl(this.props.templatePath, this.props.componentPath, this.props);
  }

  _updateModuleStories() {
    if (!this.props.isAddComponentToStoryBook) {
      return;
    }
    const moduleStoriesPath = this._getModuleStoriesPath({
      isAbsolute: true
    });
    const fileText = this.fs.read(moduleStoriesPath);
    const importStatement = `import ${this.props.componentName} from './${this._getComponentFileName()};'`;
    const fileWithImportText = ast.addImportStatementAndParse(fileText, importStatement);
    this.fs.write(moduleStoriesPath, fileWithImportText);
  }

  writing() {
    if (!this._canWrite()) {
      return;
    }
    this._writeComponent();
    // this._updateModuleStories();
  }

  end() {
    this._end();
  }
};
