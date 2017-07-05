const pascalCase = require('pascal-case');
const VulcanGenerator = require('../../lib/VulcanGenerator');
const chalk = require('chalk');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._assertIsVulcan();
    this._assertHasNonZeroPackages();
    this.inputProps = {};
  }

  prompting() {
    if (!this._canPrompt()) {
      return false;
    }
    const firstQuestions = [this._getStoryBookSetupQuestion(), this._getPackageNameListQuestion()];

    return this.prompt(firstQuestions).then(answers => {
      this.props = {
        packageName: this._filterPackageName(this.inputProps.packageName || answers.packageName),
        storyBookStatus: this.inputProps.storyBookStatus || answers.storyBookStatus
      };
      this._assertPackageHasNonZeroModules(this.props.packageName);
      const secondQuestions = [this._getModuleNameListQuestion(), this._getComponentNameQuestion(), this._getIsRegisterComponentQuestion()];
      if (this._packageHasNonZeroModules(this.props.packageName)) {
        return this.prompt(secondQuestions);
      }
      return Promise.reject('noModulesInPackage');
    }).then(answers => {
      this.props = Object.assign({}, this.props, {
        moduleName: this.inputProps.moduleName || answers.moduleName,
        componentName: pascalCase(this.inputProps.componentName || answers.componentName),
        componentType: this.inputProps.componentType || answers.componentType,
        isRegister: this.inputProps.isRegister || answers.isRegister
      });
      this.props.componentPath = this._getComponentsPath({ isAbsolute: true }, this.props.moduleName, `${this.props.componentName}.${this._getReactExtension()}`);
      this.props.templatePath = this.props.componentType === 'pure' ? this.templatePath('pureFunctionComponent.js') : this.templatePath('classComponent.js');
      this._assertModuleIsExists(this.props.packageName, this.props.moduleName);
    }, () => {});
  }

  configuring() {
    if (!this._canConfigure()) {
      return;
    }
    const actions = {
      dontask: 'SET_STORYBOOK_DONT_ASK',
      pending: 'SET_STORYBOOK_PENDING',
      installing: 'SET_STORYBOOK_INSTALLING'
    };
    const action = actions[this.props.storyBookStatus];
    if (action) {
      this._dispatch({
        type: actions[this.props.storyBookStatus]
      });
    }
    this._commitStore();
  }

  _canInstall() {
    return super._canInstall() && this.props.storyBookStatus === 'installing';
  }

  install() {
    if (!this._canInstall()) {
      return;
    }
    this.log(chalk.green('\nTaking you to react storybook setup... \n'));
    this.spawnCommandSync('getstorybook');
    this._dispatch({
      type: 'SET_STORYBOOK_INSTALLED'
    });
  }

  writing() {
    if (!this._canWrite()) {
      return;
    }
    this.fs.copyTpl(this.props.templatePath, this.props.componentPath, this.props);
  }

  end() {
    this._end();
  }
};
//# sourceMappingURL=index.js.map
