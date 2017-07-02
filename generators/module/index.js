const Generator = require('yeoman-generator');
const pascalCase = require('pascal-case');
const path = require('path');
const camelCase = require('camelcase');
const VulcanGenerator = require('../../libs/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._checkVulcan();
    this.configProps = {
      packageName: this.config.get('packageName'),
    };
  }

  _getSetFromArr(arr) {
    const set = {};
    arr.forEach((elem) => {
      set[elem] = true;
    });
    return set;
  }

  prompting() {
    if (!this._canPrompt()) { return; }
    // this.inputProps = {
    //   packageName: 'myPackage',
    //   moduleName: 'myModule',
    //   defaultResolvers: { list: true, single: true, total: true },
    // };
    this.inputProps = {};
    const questions = [
      {
        type: 'input',
        name: 'packageName',
        message: 'Package name',
        default: this.configProps.packageName,
        when: () => (!this.inputProps.packageName),
      },
      {
        type: 'input',
        name: 'moduleName',
        message: 'Module name',
        when: () => (!this.inputProps.moduleName),
      },
      {
        type: 'checkbox',
        name: 'moduleParts',
        message: 'Create with',
        choices: [
          { name: 'Collection', value: 'collection', checked:true, disabled: true },
          { name: 'Fragments', value: 'fragments', checked:true },
          { name: 'Mutations', value: 'mutations', checked:true },
          { name: 'Parameters', value: 'parameters', checked:true },
          { name: 'Permissions', value: 'permissions', checked:true },
          { name: 'Resolvers', value: 'resolvers', checked:true },
          { name: 'Schema', value: 'schema', checked:true },
        ],
        when: () => (!this.inputProps.moduleParts),
        filter: this._getSetFromArr,
      },
      {
        type: 'checkbox',
        name: 'defaultResolvers',
        message: 'Default Resolvers',
        choices: [
          { name: 'List', value: 'list', checked: true },
          { name: 'Single', value: 'single', checked: true },
          { name: 'Total', value: 'total', checked: true },
        ],
        when: (answers) => (
          !this.inputProps.defaultResolvers &&
          answers.moduleParts.resolvers
        ),
        filter: this._getSetFromArr,
      },
    ];

    return this.prompt(questions).then((answers) => {
      const packageName = this.inputProps.packageName || answers.packageName;
      const moduleName = this.inputProps.moduleName || answers.moduleName;
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
        listResolverName: `${camelModuleName}List`,
        singleResolverName: `${camelModuleName}Single`,
        totalResolverName: `${camelModuleName}Total`,
        moduleParts: this.inputProps.packageName || answers.moduleParts,
      };
      if (this.props.moduleParts.resolvers) {
        const defaultResolvers = this.inputProps.defaultResolvers || answers.defaultResolvers;
        this.props.hasListResolver = defaultResolvers['list'];
        this.props.hasSingleResolver = defaultResolvers['single'];
        this.props.hasTotalResolver = defaultResolvers['total'];
      }
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
    if (!this._canConfigure()) { return; }
    this.originalRoot = this.destinationRoot();
    this.destinationRoot(
      this.destinationPath(
        this._getModulePath()
      )
    );
    this.config.set('moduleName', this.props.moduleName);
    this.destinationRoot(this.originalRoot);
  }

  _writeCollection() {
    this.fs.copyTpl(
      this.templatePath('collection.js'),
      this.destinationPath(
        this._getModulePath(),
        'collection.js'
      ),
      this.props
    );
  }

  _writeResolvers() {
    if (!this.props.moduleParts.resolvers) { return; }
    this.fs.copyTpl(
      this.templatePath('resolvers.js'),
      this.destinationPath(
        this._getModulePath(),
        'resolvers.js'
      ),
      this.props
    );
  }

  _writeFragments() {
    if (!this.props.moduleParts.fragments) { return; }
    this.fs.copyTpl(
      this.templatePath('fragments.js'),
      this.destinationPath(
        this._getModulePath(),
        'fragments.js'
      ),
      this.props
    );
  }

  _writeMutations() {
    if (!this.props.moduleParts.mutations) { return; }
    this.fs.copyTpl(
      this.templatePath('mutations.js'),
      this.destinationPath(
        this._getModulePath(),
        'mutations.js'
      ),
      this.props
    );
  }

  _writeParameters() {
    if (!this.props.moduleParts.parameters) { return; }
    this.fs.copyTpl(
      this.templatePath('parameters.js'),
      this.destinationPath(
        this._getModulePath(),
        'parameters.js'
      ),
      this.props
    );
  }

  _writePermissions() {
    if (!this.props.moduleParts.permissions) { return; }
    this.fs.copyTpl(
      this.templatePath('permissions.js'),
      this.destinationPath(
        this._getModulePath(),
        'permissions.js'
      ),
      this.props
    );
  }

  _writeSchema() {
    if (!this.props.moduleParts.schema) { return; }
    this.fs.copyTpl(
      this.templatePath('schema.js'),
      this.destinationPath(
        this._getModulePath(),
        'schema.js'
      ),
      this.props
    );
  }

  writing() {
    if (!this._canWrite()) { return; }
    this._writeCollection();
    this._writeResolvers();
    this._writeFragments();
    this._writeMutations();
    this._writeParameters();
    this._writePermissions();
    this._writeSchema();
  }

  end() {
    this._end();
  }
};
