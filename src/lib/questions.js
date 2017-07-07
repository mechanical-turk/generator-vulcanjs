const uiText = require('./ui-text');
const common = require('./common');
const validations = require('./validations');

function get (questionName) {
  const appName = {
    type: 'input',
    name: 'appName',
    message: uiText.messages.appName,
    when: () => (!this.inputProps.appName),
    default: this.options.appname,
    validate: validations.assertNonEmpty,
  };
  const packageName = {
    type: 'input',
    name: 'packageName',
    message: uiText.messages.packageName,
    when: () => (!this.inputProps.packageName),
    default: this.options.packagename,
    validate: validations.assertNonEmpty,
  };
  const packageNameList = {
    type: 'list',
    name: 'packageName',
    message: uiText.messages.packageName,
    when: () => (!this.inputProps.packageName),
    choices: this._getPackageNames(),
    default: common.getDefaultChoiceIndex(
      this._getPackageNames(),
      this.options.packagename
    ),
  };
  const moduleNameInput = {
    type: 'input',
    name: 'moduleName',
    message: uiText.messages.moduleName,
    when: () => (!this.inputProps.moduleName),
    default: this.options.moduleName,
    validate: validations.assertNonEmpty,
  };
  const moduleNameList = {
    type: 'list',
    name: 'moduleName',
    message: uiText.messages.moduleName,
    when: () => (!this.inputProps.moduleName),
    choices: (answers) => {
      const finalPackageName = this._getFinalPackageName(answers);
      return this._getModuleNames(finalPackageName);
    },
    default: (answers) => {
      const finalPackageName = this._getFinalPackageName(answers);
      return common.getDefaultChoiceIndex(
        this._getModuleNames(finalPackageName),
        this.options.moduleName
      );
    },
  };
  const isPackageAutoAdd = {
    type: 'confirm',
    name: 'isPackageAutoAdd',
    message: uiText.messages.isPackageAutoAdd,
    when: () => (!this.inputProps.packageName),
  };
  const componentName = {
    type: 'input',
    name: 'componentName',
    message: uiText.messages.componentName,
    when: () => (!this.inputProps.componentName),
    validate: validations.assertNonEmpty,
  };
  const componentType = {
    type: 'list',
    name: 'componentType',
    message: uiText.messages.componentType,
    choices: [
      { name: 'Pure Function', value: 'pure' },
      { name: 'Class Component', value: 'class' },
    ],
    when: () => (!this.inputProps.componentType),
  };
  const isRegisterComponent = {
    type: 'confirm',
    name: 'isRegister',
    message: uiText.messages.isRegisterComponent,
    when: () => (!this.inputProps.isRegister),
  };
  const storyBookSetup = {
    type: 'list',
    name: 'storyBookSetupStatus',
    message: uiText.messages.storyBookSetupStatus,
    choices: [
      { name: 'Yes, take me to storybook setup after this.', value: 'installing' },
      { name: 'No, ask later.', value: 'pending' },
      { name: 'No, and dont ask again.', value: 'dontask' },
    ],
    when: () => {
      const storyBookSetupStatus = this._getStoryBookSetupStatus();
      const allowedStatuses = {
        pending: true,
        installing: true,
        askagain: true,
      };
      const isStatusAllowsSetupQuestion = allowedStatuses[storyBookSetupStatus];
      return (!this.inputProps.packageName && isStatusAllowsSetupQuestion);
    },
  };
  const isAddComponentToStoryBook = {
    type: 'confirm',
    name: 'isAddComponentToStoryBook',
    message: uiText.messages.isAddComponentToStoryBook,
    when: () => (!this.inputProps.isAddComponentToStoryBook),
  };
  const moduleCreateWith = {
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
    filter: common.getSetFromArr,
  };
  const defaultResolver = {
    type: 'checkbox',
    name: 'defaultResolvers',
    message: 'Default resolvers',
    choices: [
      { name: 'List', value: 'list', checked: true },
      { name: 'Single', value: 'single', checked: true },
      { name: 'Total', value: 'total', checked: true },
    ],
    when: () => (!this.inputProps.defaultResolvers),
    filter: common.getSetFromArr,
  };
  const vulcanDependencies = {
    type: 'checkbox',
    name: 'vulcanDependencies',
    message: uiText.messages.vulcanDependencies,
    choices: [
      { name: 'vulcan:core', checked: true },
      'vulcan:posts',
      'vulcan:comments',
      'vulcan:newsletter',
      'vulcan:notifications',
      'vulcan:getting-started',
      'vulcan:categories',
      'vulcan:voting',
      'vulcan:embedly',
      'vulcan:api',
      'vulcan:rss',
      'vulcan:subscribe',
    ],
    when: () => (!this.inputProps.vulcanDependencies),
  };
  const reactExtension = {
    type: 'list',
    name: 'reactExtension',
    message: uiText.messages.reactExtension,
    choices: common.reactExtensions,
    when: () => (!this.inputProps.reactExtension),
    default: common.getDefaultChoiceIndex(
      common.reactExtensions,
      this.options.reactextension
    ),
  };
  const packageManager = {
    type: 'list',
    name: 'packageManager',
    message: uiText.messages.packageManager,
    choices: common.packageManagers,
    when: () => (!this.inputProps.packageManager),
    default: common.getDefaultChoiceIndex(
      common.packageManagers,
      this.options.packagemanager
    ),
  };
  const isAddCustomSchemaProperty = {
    type: 'confirm',
    name: 'isAddCustomSchemaProperty',
    message: uiText.messages.IsAddCustomSchemaProperty,
    when: () => (!this.inputProps.IsAddCustomSchemaProperty),
  };
  const schemaPropertyName = {
    type: 'input',
    name: 'schemaPropertyName',
    message: uiText.messages.schemaPropertyName,
    // when: () => (!this.inputProps.schemaPropertyName),
    validate: validations.assertNonEmpty,
  };
  const isSchemaPropertyHidden = {
    type: 'confirm',
    name: 'isSchemaPropertyHidden',
    message: uiText.messages.isSchemaPropertyHidden,
  };
  const schemaPropertyLabel = {
    type: 'input',
    name: 'schemaPropertyLabel',
    message: uiText.messages.schemaPropertyLabel,
    when: (answers) => (!answers.isSchemaPropertyHidden),
    validate: validations.assertNonEmpty,
  };
  const schemaPropertyType = {
    type: 'list',
    name: 'schemaPropertyType',
    message: uiText.messages.schemaPropertyType,
    choices: common.schemaPropertyTypes,
    // when: () => (!this.inputProps.schemaPropertyType),
  };
  const isSchemaPropertyOptional = {
    type: 'confirm',
    name: 'isSchemaPropertyOptional',
    message: uiText.messages.isSchemaPropertyOptional,
    // when: () => (!this.inputProps.schemaPropertyType),
  };
  const schemaPropertyViewableBy = {
    type: 'checkbox',
    name: 'schemaPropertyViewableBy',
    message: uiText.messages.schemaPropertyViewableBy,
    choices: common.visitorTypes,
  };
  const schemaPropertyInsertableBy = {
    type: 'checkbox',
    name: 'schemaPropertyInsertableBy',
    message: uiText.messages.schemaPropertyInsertableBy,
    choices: common.visitorTypes,
  };
  const schemaPropertyEditableBy = {
    type: 'checkbox',
    name: 'schemaPropertyEditableBy',
    message: uiText.messages.schemaPropertyEditableBy,
    choices: common.visitorTypes,
  };
  const isAddAnotherCustomSchemaProperty = {
    type: 'confirm',
    name: 'isAddAnotherCustomSchemaProperty',
    message: uiText.messages.isAddAnotherCustomSchemaProperty,
    // when: () => (!this.inputProps.IsAddCustomSchemaProperty),
  };
  const questions = {
    appName,
    packageName,
    packageNameList,
    moduleNameInput,
    moduleNameList,
    isPackageAutoAdd,
    componentName,
    componentType,
    isRegisterComponent,
    storyBookSetup,
    isAddComponentToStoryBook,
    moduleCreateWith,
    defaultResolver,
    vulcanDependencies,
    reactExtension,
    packageManager,
    isAddCustomSchemaProperty,
    schemaPropertyName,
    isSchemaPropertyHidden,
    schemaPropertyLabel,
    schemaPropertyType,
    isSchemaPropertyOptional,
    schemaPropertyViewableBy,
    schemaPropertyInsertableBy,
    schemaPropertyEditableBy,
    isAddAnotherCustomSchemaProperty,
  };
  return questions[questionName];
}

module.exports = {
  get,
};
