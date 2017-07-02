const Generator = require('yeoman-generator');
const pascalCase = require('pascal-case');
const common = require('../../common');

module.exports = class extends Generator {
  initializing() {
    common.beautify.bind(this)();
    this.configProps = {
      packageName: this.config.get('packageName'),
      reactExtension: this.config.get('reactExtension'),
      moduleName: this.config.get('moduleName'),
    };
  }

  prompting() {
    this.inputProps = {};
    const questions = [];
    if (!this.inputProps.packageName) {
      questions.push({
        type: 'input',
        name: 'packageName',
        message: 'Package name',
        default: this.configProps.packageName,
      });
    }

    if (!this.inputProps.moduleName) {
      questions.push({
        type: 'input',
        name: 'moduleName',
        message: 'Module name',
        default: this.configProps.moduleName,
      });
    }

    if (!this.inputProps.componentName) {
      questions.push({
        type: 'input',
        name: 'componentName',
        message: 'Component name',
        default: this.configProps.moduleName,
      });
    }

    if (!this.inputProps.componentType) {
      questions.push({
        type: 'list',
        name: 'componentType',
        message: 'Component type',
        choices: [
          { name: 'Pure Function', value: 'pure' },
          { name: 'Class Component', value: 'class' },
        ],
      });
    }

    if (!this.inputProps.isRegister) {
      questions.push({
        type: 'confirm',
        name: 'isRegister',
        message: 'Should the component be registered?',
      });
    }

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
        `${this.props.componentName}.${this.configProps.reactExtension}`
      );
      this.props.templatePath = this.props.componentType === 'pure' ?
        this.templatePath('pureFunctionComponent.js') :
        this.templatePath('classComponent.js');
    });
  }

  writing() {
    this.fs.copyTpl(
      this.props.templatePath,
      this.props.componentPath,
      this.props
    );
  }
};
