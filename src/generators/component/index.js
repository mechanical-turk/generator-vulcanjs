const pascalCase = require('pascal-case');
const VulcanGenerator = require('../../lib/VulcanGenerator');
const chalk = require('chalk');

module.exports = class extends VulcanGenerator {
  initializing () {
    this._assertIsVulcan();
    this._assertHasNonZeroPackages();
    this.inputProps = {};
  }

  prompting () {
    if (!this._canPrompt()) { return false; }
    const firstQuestions = [
      this._getStoryBookSetupQuestion(),
      this._getPackageNameListQuestion(),
    ];

    return this.prompt(firstQuestions)
    .then((answers) => {
      this.props = {
        packageName: this._filterPackageName(this.inputProps.packageName || answers.packageName),
        storyBookSetupStatus: this.inputProps.storyBookSetupStatus || answers.storyBookSetupStatus,
      };
      this._assertPackageHasNonZeroModules(this.props.packageName);
      const secondQuestions = [
        this._getModuleNameListQuestion(),
        this._getComponentNameQuestion(),
        this._getIsRegisterComponentQuestion(),
        this._getIsAddComponentToStoryBookQuestion(),
      ];
      if (this._packageHasNonZeroModules(this.props.packageName)) {
        return this.prompt(secondQuestions);
      }
      return Promise.reject('noModulesInPackage');
    })
    .then((answers) => {
      this.props = {
        ...this.props,
        moduleName: this.inputProps.moduleName || answers.moduleName,
        componentName: pascalCase(this.inputProps.componentName || answers.componentName),
        componentType: this.inputProps.componentType || answers.componentType,
        isRegister: this.inputProps.isRegister || answers.isRegister,
        isAddComponentToStoryBook: (
          this.inputProps.isAddComponentToStoryBook ||
          answers.isAddComponentToStoryBook
        ),
      };
      this.props.componentPath = this._getModuleInComponentsPath(
        { isAbsolute: true },
        `${this.props.componentName}.${this._getReactExtension()}`
      );
      this.props.templatePath = this.props.componentType === 'pure' ?
        this.templatePath('pureFunctionComponent.js') :
        this.templatePath('classComponent.js');
      this._assertModuleIsExists(this.props.packageName, this.props.moduleName);
    }, () => {});
  }

  configuring () {
    if (!this._canConfigure()) { return; }
    if (this.props.storyBookSetupStatus) {
      this._dispatch({
        type: 'SET_STORYBOOK_SETUP_STATUS',
        status: this.props.storyBookSetupStatus,
      });
    }
    this._commitStore();
    this._installStorybook();
  }

  _canInstall () {
    return super._canInstall() && this._getStoryBookSetupStatus() === 'installing';
  }

  _installStorybook () {
    if (!this._canInstall()) { return; }
    this.log(chalk.green('\nTaking you to react storybook setup... \n'));
    this.spawnCommandSync('getstorybook');
    console.log('SETTING UP!');
    this._dispatch({
      type: 'SET_STORYBOOK_SETUP_STATUS',
      status: 'installed',
    });
    this._commitStore();
  }

  _writeComponent () {
    this.fs.copyTpl(
      this.props.templatePath,
      this.props.componentPath,
      this.props
    );
  }

  writing () {
    if (!this._canWrite()) { return; }
    this._writeComponent();
  }

  end () {
    this._end();
  }
};
