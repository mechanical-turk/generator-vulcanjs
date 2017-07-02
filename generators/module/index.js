const Generator = require('yeoman-generator');
const pascalCase = require('pascal-case');
const path = require('path');
const camelCase = require('camelcase');
const common = require('../../common');

module.exports = class extends Generator {
  initializing() {
    common.beautify.bind(this)();
    this.configProps = {
      packageName: this.config.get('packageName'),
    };
  }

  prompting() {
    // this.inputProps = {
    //   packageName: 'keremPackage',
    //   moduleName: 'keremModule',
    //   defaultResolvers: [ 'list', 'single', 'total' ],
    // };
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
      });
    }

    if (!this.inputProps.defaultResolvers) {
      questions.push({
        type: 'checkbox',
        name: 'defaultResolvers',
        message: 'Default resolvers',
        choices: [
          { name: 'List', value: 'list' },
          { name: 'Single', value: 'single' },
          { name: 'Total', value: 'total' },
        ],
      });
    }

    return this.prompt(questions).then((answers) => {
      const packageName = this.inputProps.packageName || answers.packageName;
      const moduleName = this.inputProps.moduleName || answers.moduleName;
      const camelModuleName = camelCase(moduleName);
      const pascalModuleName = pascalCase(moduleName);
      const defaultResolversArr =
        this.inputProps.defaultResolvers ||
        answers.defaultResolvers;
      const defaultResolvers = {};
      defaultResolversArr.forEach((resolver) => {
        defaultResolvers[resolver] = true;
      });

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
        listResolverName: `${camelModuleName}List`,
        singleResolverName: `${camelModuleName}Single`,
        totalResolverName: `${camelModuleName}Total`,
        hasListResolver: defaultResolvers['list'],
        hasSingleResolver: defaultResolvers['single'],
        hasTotalResolver: defaultResolvers['total'],
      };
    });
  }

  _getModulePath() {
    return path.join(
      'packages',
      this.props.packageName,
      'lib',
      'modules',
      this.props.moduleName
    );
  }

  configuring() {
    this.originalRoot = this.destinationRoot();
    this.destinationRoot(
      this.destinationPath(
        this._getModulePath()
      )
    );
    this.config.set('moduleName', this.props.moduleName);
    this.destinationRoot(this.originalRoot);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('collection.js'),
      this.destinationPath(
        this._getModulePath(),
        'collection.js'
      ),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('resolvers.js'),
      this.destinationPath(
        this._getModulePath(),
        'resolvers.js'
      ),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('fragments.js'),
      this.destinationPath(
        this._getModulePath(),
        'fragments.js'
      ),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('mutations.js'),
      this.destinationPath(
        this._getModulePath(),
        'mutations.js'
      ),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('parameters.js'),
      this.destinationPath(
        this._getModulePath(),
        'parameters.js'
      ),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('permissions.js'),
      this.destinationPath(
        this._getModulePath(),
        'permissions.js'
      ),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('schema.js'),
      this.destinationPath(
        this._getModulePath(),
        'schema.js'
      ),
      this.props
    );
  }
};
