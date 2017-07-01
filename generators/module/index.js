const Generator = require('yeoman-generator');
const beautify = require('gulp-beautify');
const pascalCase = require('pascal-case');
const path = require('path');
const camelCase = require('camelcase');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this.registerTransformStream(beautify({indent_size: 2 }));
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

  writing() {
    const moduleSubPath = path.join(
      'packages',
      this.props.packageName,
      'lib',
      'modules',
      this.props.moduleName,
    );

    this.fs.copyTpl(
      this.templatePath('collection.js'),
      this.destinationPath(moduleSubPath, 'collection.js'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('resolvers.js'),
      this.destinationPath(moduleSubPath, 'resolvers.js'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('fragments.js'),
      this.destinationPath(moduleSubPath, 'fragments.js'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('mutations.js'),
      this.destinationPath(moduleSubPath, 'mutations.js'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('parameters.js'),
      this.destinationPath(moduleSubPath, 'parameters.js'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('permissions.js'),
      this.destinationPath(moduleSubPath, 'permissions.js'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('schema.js'),
      this.destinationPath(moduleSubPath, 'schema.js'),
      this.props
    );
  }
};
