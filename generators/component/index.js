const Generator = require('yeoman-generator');
const pascalCase = require('pascal-case');
const VulcanGenerator = require('../../libs/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._assertIsVulcan();
  }

  prompting() {
    if (!this._canPrompt()) { return; }
    this.inputProps = {};
    const questions = [
      {
        type: 'input',
        name: 'packageName',
        message: 'Package name',
        when: () => (!this.inputProps.packageName),
      },
      {
        type: 'input',
        name: 'moduleName',
        message: 'Module name',
        when: () => (!this.inputProps.moduleName),
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name',
        when: () => (!this.inputProps.componentName),
      },
      {
        type: 'list',
        name: 'componentType',
        message: 'Component type',
        choices: [
          { name: 'Pure Function', value: 'pure' },
          { name: 'Class Component', value: 'class' },
        ],
        when: () => (!this.inputProps.componentType),
      },
      {
        type: 'confirm',
        name: 'isRegister',
        message: 'Should the component be registered?',
        when: () => (!this.inputProps.isRegister),
      }
    ];

    return this.prompt(questions).then((answers) => {
      this.props = {
        packageName: this.inputProps.packageName || answers.packageName,
        moduleName: this.inputProps.moduleName || answers.moduleName,
        componentName: pascalCase(this.inputProps.componentName || answers.componentName),
        componentType: this.inputProps.componentType || answers.componentType,
        isRegister: this.inputProps.isRegister || answers.isRegister,
      };
      this.props.componentPath = this.destinationPath(
        'packages',
        this.props.packageName,
        'lib',
        'components',
        this.props.moduleName,
        `${this.props.componentName}.${this._getConfigProp('reactExtension')}`
      );
      this.props.templatePath = this.props.componentType === 'pure' ?
        this.templatePath('pureFunctionComponent.js') :
        this.templatePath('classComponent.js');
    });
  }

  configuring() {
    if (!this._canConfigure()) { return; }
    this._commitStore();
  }

  writing() {
    if (!this._canWrite()) { return; }
    this.fs.copyTpl(
      this.props.templatePath,
      this.props.componentPath,
      this.props
    );
  }

  end() {
    this._end();
  }
};
