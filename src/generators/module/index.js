import path from 'path';
import pascalCase from 'pascal-case';
import camelCase from 'camelcase';
import VulcanGenerator from '../../lib/VulcanGenerator';

module.exports = class extends VulcanGenerator {
  initializing () {
    this._assertIsVulcan();
    this._assertHasNonZeroPackages();
    this.inputProps = {};
  }

  _getSetFromArr (arr) {
    const set = {};
    arr.forEach((elem) => {
      set[elem] = true;
    });
    return set;
  }

  prompting () {
    if (!this._canPrompt()) { return; }
    const questions = [
      this._getPackageNameListQuestion(),
      this._getModuleNameInputQuestion(),
      {
        type: 'checkbox',
        name: 'moduleParts',
        message: 'Create with',
        choices: [
          { name: 'Collection', value: 'collection', checked: true, disabled: true },
          { name: 'Fragments', value: 'fragments', checked: true },
          { name: 'Mutations', value: 'mutations', checked: true },
          { name: 'Parameters', value: 'parameters', checked: true },
          { name: 'Permissions', value: 'permissions', checked: true },
          { name: 'Resolvers', value: 'resolvers', checked: true },
          { name: 'Schema', value: 'schema', checked: true },
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

    return this.prompt(questions)
    .then((answers) => {
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
        listResolverName: `${camelModuleName}List`,
        singleResolverName: `${camelModuleName}Single`,
        totalResolverName: `${camelModuleName}Total`,
        moduleParts: this.inputProps.packageName || answers.moduleParts,
      };
      if (this.props.moduleParts.resolvers) {
        const defaultResolvers = this.inputProps.defaultResolvers || answers.defaultResolvers;
        this.props.hasListResolver = defaultResolvers.list;
        this.props.hasSingleResolver = defaultResolvers.single;
        this.props.hasTotalResolver = defaultResolvers.total;
      }
      this._assertIsPackageExists(this.props.packageName);
      this._assertModuleNotExists(this.props.packageName, this.props.moduleName);
    });
  }

  configuring () {
    if (!this._canConfigure()) { return; }
    this._dispatch({
      type: 'ADD_MODULE',
      packageName: this.props.packageName,
      moduleName: this.props.moduleName,
    });
    this._commitStore();
  }

  _writeCollection () {
    this.fs.copyTpl(
      this.templatePath('collection.js'),
      path.join(
        this._getModulePath(),
        'collection.js'
      ),
      this.props
    );
  }

  _writeResolvers () {
    if (!this.props.moduleParts.resolvers) { return; }
    this.fs.copyTpl(
      this.templatePath('resolvers.js'),
      path.join(
        this._getModulePath(),
        'resolvers.js'
      ),
      this.props
    );
  }

  _writeFragments () {
    if (!this.props.moduleParts.fragments) { return; }
    this.fs.copyTpl(
      this.templatePath('fragments.js'),
      path.join(
        this._getModulePath(),
        'fragments.js'
      ),
      this.props
    );
  }

  _writeMutations () {
    if (!this.props.moduleParts.mutations) { return; }
    this.fs.copyTpl(
      this.templatePath('mutations.js'),
      path.join(
        this._getModulePath(),
        'mutations.js'
      ),
      this.props
    );
  }

  _writeParameters () {
    if (!this.props.moduleParts.parameters) { return; }
    this.fs.copyTpl(
      this.templatePath('parameters.js'),
      path.join(
        this._getModulePath(),
        'parameters.js'
      ),
      this.props
    );
  }

  _writePermissions () {
    if (!this.props.moduleParts.permissions) { return; }
    this.fs.copyTpl(
      this.templatePath('permissions.js'),
      path.join(
        this._getModulePath(),
        'permissions.js'
      ),
      this.props
    );
  }

  _writeSchema () {
    if (!this.props.moduleParts.schema) { return; }
    this.fs.copyTpl(
      this.templatePath('schema.js'),
      path.join(
        this._getModulePath(),
        'schema.js'
      ),
      this.props
    );
  }

  _updateModulesIndex () {
    const modulePath = this._getModulesIndexPath();
    const file = this.fs.read(modulePath);
    const newFile = `import './${this.props.moduleName}/collection.js'; ${file}`;
    this.fs.write(
      modulePath,
      newFile
    );
  }

  writing () {
    if (!this._canWrite()) { return; }
    this._writeCollection();
    this._writeResolvers();
    this._writeFragments();
    this._writeMutations();
    this._writeParameters();
    this._writePermissions();
    this._writeSchema();
    this._updateModulesIndex();
  }

  end () {
    this._end();
  }
};
