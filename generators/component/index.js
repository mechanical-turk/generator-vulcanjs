const Generator = require('yeoman-generator');
const pascalCase = require('pascal-case');
const VulcanGenerator = require('../../libs/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._assertIsVulcan();
    this._assertHasNonZeroPackages();
    this.inputProps = {};
  }

  prompting() {
    if (!this._canPrompt()) { return; }
    const firstQuestions = [
      {
        type: 'list',
        name: 'packageName',
        message: 'Package name',
        when: () => (!this.inputProps.packageName),
        choices: this._getPackageNames(),
      },
    ];

    return this.prompt(firstQuestions)
    .then((answers) => {
      this.props = {
        packageName: this._filterPackageName(this.inputProps.packageName || answers.packageName),
      };
      this._assertPackageHasNonZeroModules(this.props.packageName);
      const secondQuestions = [
        {
          type: 'list',
          name: 'moduleName',
          message: 'Module name',
          when: () => (!this.inputProps.moduleName),
          choices: (answers) => {
            return this._getModuleNames(this.props.packageName);
          }
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
          message: 'Register component',
          when: () => (!this.inputProps.isRegister),
        }
      ];
      if (this._packageHasNonZeroModules(this.props.packageName)) {
        return this.prompt(secondQuestions);
      }
      return Promise.reject('noModulesInPackage');
    })
    .then((answers) => {
      this.props = Object.assign(
        {},
        this.props,
        {
          moduleName: this.inputProps.moduleName || answers.moduleName,
          componentName: pascalCase(this.inputProps.componentName || answers.componentName),
          componentType: this.inputProps.componentType || answers.componentType,
          isRegister: this.inputProps.isRegister || answers.isRegister,
        },
      );
      this.props.componentPath = this.destinationPath(
        'packages',
        this.props.packageName,
        'lib',
        'components',
        this.props.moduleName,
        `${this.props.componentName}.${this._getReactExtension()}`
      );
      this.props.templatePath = this.props.componentType === 'pure' ?
        this.templatePath('pureFunctionComponent.js') :
        this.templatePath('classComponent.js');
      this._assertModuleIsExists(this.props.packageName, this.props.moduleName);
    }, () => {});
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
