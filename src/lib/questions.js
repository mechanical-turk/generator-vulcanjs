const uiText = require('./ui-text');
const common = require('./common');
const store = require('./store');
const validations = require('./validations');
const finalize = require('./finalizers').finalize;

let generator;

function setup (generatorSetup) {
  generator = generatorSetup;
}

function get (...questionNames) {
  function appName () {
    return {
      type: 'input',
      name: 'appName',
      message: uiText.messages.appName,
      when: () => (!generator.inputProps.appName),
      default: generator.options.appname,
      validate: validations.assertNonEmpty,
    };
  }

  function reactExtension () {
    return {
      type: 'list',
      name: 'reactExtension',
      message: uiText.messages.reactExtension,
      choices: common.reactExtensions,
      when: () => (!generator.inputProps.reactExtension),
      default: common.getDefaultChoiceIndex(
        common.reactExtensions,
        generator.options.reactextension
      ),
    };
  }

  function packageManager () {
    return {
      type: 'list',
      name: 'packageManager',
      message: uiText.messages.packageManager,
      choices: common.packageManagers,
      when: () => (!generator.inputProps.packageManager),
      default: common.getDefaultChoiceIndex(
        common.packageManagers,
        generator.options.packagemanager
      ),
    };
  }

  function packageName () {
    return {
      type: 'input',
      name: 'packageName',
      message: uiText.messages.packageName,
      when: () => !generator.inputProps.packageName,
      default: generator.options.packagename,
      validate: validations.combineValidators(
        validations.assertNonEmpty,
        validations.assertNotPackageExists
      ),
    };
  }

  function vulcanDependencies () {
    return {
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
      when: () => !generator.inputProps.vulcanDependencies,
    };
  }

  function isPackageAutoAdd () {
    return {
      type: 'confirm',
      name: 'isPackageAutoAdd',
      message: uiText.messages.isPackageAutoAdd,
      when: () => (!generator.inputProps.packageName),
    };
  }

  function packageNameList () {
    return {
      type: 'list',
      name: 'packageName',
      message: uiText.messages.packageName,
      when: () => (!generator.inputProps.packageName),
      choices: store.get('packageNames'),
      default: common.getDefaultChoiceIndex(
        store.get('packageNames'),
        generator.options.packagename
      ),
    };
  }

  function packageNameWithNumModulesList () {
    return {
      type: 'list',
      name: 'packageName',
      message: uiText.messages.packageName,
      when: () => (!generator.inputProps.packageName),
      choices: () => (
        store.get('packageNamesWithNumModules')
        .sort(common.numModulesSort)
        .map(({ name, numModules }) => {
          if (numModules > 0) return name;
          return { name, value: name, disabled: true };
        })
      ),
      default: common.getDefaultChoiceIndex(
        store.get('packageNames'),
        generator.options.packagename
      ),
    };
  }

  function moduleName () {
    return {
      type: 'input',
      name: 'moduleName',
      message: uiText.messages.moduleName,
      when: () => (!generator.inputProps.moduleName),
      default: generator.options.moduleName,
      validate: (input, answers) => {
        const combinedValidator = validations.combineValidators(
          validations.assertNonEmpty,
          validations.generateNotModuleExists(
            finalize('packageName', answers)
          )
        );
        return combinedValidator(input, answers);
      },
    };
  }

  function moduleCreateWith () {
    return {
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
      when: () => (!generator.inputProps.moduleParts),
      filter: common.getSetFromArr,
    };
  }

  function moduleNameList () {
    return {
      type: 'list',
      name: 'moduleName',
      message: uiText.messages.moduleName,
      when: () => (!generator.inputProps.moduleName),
      choices: (answers) => {
        const finalPackageName = finalize('packageName', answers);
        return store.get('moduleNames', finalPackageName);
      },
      default: (answers) => {
        const finalPackageName = finalize('packageName', answers);
        const moduleNames = store.get('moduleNames', finalPackageName);
        return common.getDefaultChoiceIndex(
          moduleNames,
          generator.options.moduleName
        );
      },
    };
  }

  function defaultResolvers () {
    return {
      type: 'checkbox',
      name: 'defaultResolvers',
      message: 'Default resolvers',
      choices: [
        { name: 'List', value: 'list', checked: true },
        { name: 'Single', value: 'single', checked: true },
        { name: 'Total', value: 'total', checked: true },
      ],
      when: () => (!generator.inputProps.defaultResolvers),
      filter: common.getSetFromArr,
    };
  }

  // const componentName = {
  //   type: 'input',
  //   name: 'componentName',
  //   message: uiText.messages.componentName,
  //   when: () => (!generator.inputProps.componentName),
  //   validate: validations.assertNonEmpty,
  // };
  // const componentType = {
  //   type: 'list',
  //   name: 'componentType',
  //   message: uiText.messages.componentType,
  //   choices: [
  //     { name: 'Pure Function', value: 'pure' },
  //     { name: 'Class Component', value: 'class' },
  //   ],
  //   when: () => (!generator.inputProps.componentType),
  // };
  // const isRegisterComponent = {
  //   type: 'confirm',
  //   name: 'isRegister',
  //   message: uiText.messages.isRegisterComponent,
  //   when: () => (!generator.inputProps.isRegister),
  // };
  // const storyBookSetup = {
  //   type: 'list',
  //   name: 'storyBookSetupStatus',
  //   message: uiText.messages.storyBookSetupStatus,
  //   choices: [
  //     { name: 'Yes, take me to storybook setup after this.', value: 'installing' },
  //     { name: 'No, ask later.', value: 'pending' },
  //     { name: 'No, and dont ask again.', value: 'dontask' },
  //   ],
  //   when: () => {
  //     const storyBookSetupStatus = this._getStoryBookSetupStatus();
  //     const allowedStatuses = {
  //       pending: true,
  //       installing: true,
  //       askagain: true,
  //     };
  //     const isStatusAllowsSetupQuestion = allowedStatuses[storyBookSetupStatus];
  //     return (!generator.inputProps.packageName && isStatusAllowsSetupQuestion);
  //   },
  // };
  // const isAddComponentToStoryBook = {
  //   type: 'confirm',
  //   name: 'isAddComponentToStoryBook',
  //   message: uiText.messages.isAddComponentToStoryBook,
  //   when: () => (!generator.inputProps.isAddComponentToStoryBook),
  // };


  //


  // const isAddCustomSchemaProperty = {
  //   type: 'confirm',
  //   name: 'isAddCustomSchemaProperty',
  //   message: uiText.messages.IsAddCustomSchemaProperty,
  //   when: () => (!generator.inputProps.IsAddCustomSchemaProperty),
  // };
  // const schemaPropertyName = {
  //   type: 'input',
  //   name: 'schemaPropertyName',
  //   message: uiText.messages.schemaPropertyName,
  //   // when: () => (!generator.inputProps.schemaPropertyName),
  //   validate: validations.assertNonEmpty,
  // };
  // const isSchemaPropertyHidden = {
  //   type: 'confirm',
  //   name: 'isSchemaPropertyHidden',
  //   message: uiText.messages.isSchemaPropertyHidden,
  // };
  // const schemaPropertyLabel = {
  //   type: 'input',
  //   name: 'schemaPropertyLabel',
  //   message: uiText.messages.schemaPropertyLabel,
  //   when: (answers) => (!answers.isSchemaPropertyHidden),
  //   validate: validations.assertNonEmpty,
  // };
  // const schemaPropertyType = {
  //   type: 'list',
  //   name: 'schemaPropertyType',
  //   message: uiText.messages.schemaPropertyType,
  //   choices: common.schemaPropertyTypes,
  //   // when: () => (!generator.inputProps.schemaPropertyType),
  // };
  // const isSchemaPropertyOptional = {
  //   type: 'confirm',
  //   name: 'isSchemaPropertyOptional',
  //   message: uiText.messages.isSchemaPropertyOptional,
  //   // when: () => (!generator.inputProps.schemaPropertyType),
  // };
  // const schemaPropertyViewableBy = {
  //   type: 'checkbox',
  //   name: 'schemaPropertyViewableBy',
  //   message: uiText.messages.schemaPropertyViewableBy,
  //   choices: common.visitorTypes,
  // };
  // const schemaPropertyInsertableBy = {
  //   type: 'checkbox',
  //   name: 'schemaPropertyInsertableBy',
  //   message: uiText.messages.schemaPropertyInsertableBy,
  //   choices: common.visitorTypes,
  // };
  // const schemaPropertyEditableBy = {
  //   type: 'checkbox',
  //   name: 'schemaPropertyEditableBy',
  //   message: uiText.messages.schemaPropertyEditableBy,
  //   choices: common.visitorTypes,
  // };
  // const isAddAnotherCustomSchemaProperty = {
  //   type: 'confirm',
  //   name: 'isAddAnotherCustomSchemaProperty',
  //   message: uiText.messages.isAddAnotherCustomSchemaProperty,
  //   // when: () => (!generator.inputProps.IsAddCustomSchemaProperty),
  // };

  function getSingleQuestion (questionName) {
    switch (questionName) {
      case 'appName': return appName();
      case 'reactExtension': return reactExtension();
      case 'packageManager': return packageManager();
      case 'packageName': return packageName();
      case 'vulcanDependencies': return vulcanDependencies();
      case 'isPackageAutoAdd': return isPackageAutoAdd();
      case 'packageNameList': return packageNameList();
      case 'moduleName': return moduleName();
      case 'moduleCreateWith': return moduleCreateWith();
      case 'moduleNameList': return moduleNameList();
      case 'defaultResolvers': return defaultResolvers();
      case 'packageNameWithNumModulesList': return packageNameWithNumModulesList();
      default: return undefined;
    }
  }

  return questionNames.map(getSingleQuestion);
}

module.exports = {
  get,
  setup,
};
