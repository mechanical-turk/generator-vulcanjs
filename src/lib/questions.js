const uiText = require('./ui-text');
const common = require('./common');
const store = require('./store');
const validations = require('./validations');

function get (questionName) {
  const inputProps = this.inputProps;
  const options = this.options;
  const finalize = this._finalize;

  function bindQuestions (unboundQuestions) {
    const boundQuestions = {};
    const questionKeys = Object.keys(unboundQuestions);
    questionKeys.forEach(function bindQuestion (questionKey) {
      boundQuestions[questionKey] = unboundQuestions[questionKey].bind(this);
    });
    return boundQuestions;
  }

  function appName () {
    return {
      type: 'input',
      name: 'appName',
      message: uiText.messages.appName,
      when: () => (!inputProps.appName),
      default: options.appname,
      validate: validations.assertNonEmpty,
    };
  }

  function reactExtension () {
    return {
      type: 'list',
      name: 'reactExtension',
      message: uiText.messages.reactExtension,
      choices: common.reactExtensions,
      when: () => (!inputProps.reactExtension),
      default: common.getDefaultChoiceIndex(
        common.reactExtensions,
        options.reactextension
      ),
    };
  }

  function packageManager () {
    return {
      type: 'list',
      name: 'packageManager',
      message: uiText.messages.packageManager,
      choices: common.packageManagers,
      when: () => (!inputProps.packageManager),
      default: common.getDefaultChoiceIndex(
        common.packageManagers,
        options.packagemanager
      ),
    };
  }

  function packageName () {
    return {
      type: 'input',
      name: 'packageName',
      message: uiText.messages.packageName,
      when: () => !inputProps.packageName,
      default: options.packagename,
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
      when: () => !inputProps.vulcanDependencies,
    };
  }

  function packageNameList () {
    return {
      type: 'list',
      name: 'packageName',
      message: uiText.messages.packageName,
      when: () => (!inputProps.packageName),
      choices: store.get('packageNames'),
      default: common.getDefaultChoiceIndex(
        store.get('packageNames'),
        options.packagename
      ),
    };
  }

  function moduleName () {
    return {
      type: 'input',
      name: 'moduleName',
      message: uiText.messages.moduleName,
      when: () => (!inputProps.moduleName),
      default: options.moduleName,
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
      when: () => (!inputProps.moduleParts),
      filter: common.getSetFromArr,
    };
  }
  // const moduleNameList = {
  //   type: 'list',
  //   name: 'moduleName',
  //   message: uiText.messages.moduleName,
  //   when: () => (!inputProps.moduleName),
  //   choices: (answers) => {
  //     const finalPackageName = finalize('packageName', answers);
  //     return this._getModuleNames(finalPackageName);
  //   },
  //   default: (answers) => {
  //     const finalPackageName = finalize('packageName', answers);
  //     return common.getDefaultChoiceIndex(
  //       this._getModuleNames(finalPackageName),
  //       options.moduleName
  //     );
  //   },
  // };
  // const isPackageAutoAdd = {
  //   type: 'confirm',
  //   name: 'isPackageAutoAdd',
  //   message: uiText.messages.isPackageAutoAdd,
  //   when: () => (!inputProps.packageName),
  // };
  // const componentName = {
  //   type: 'input',
  //   name: 'componentName',
  //   message: uiText.messages.componentName,
  //   when: () => (!inputProps.componentName),
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
  //   when: () => (!inputProps.componentType),
  // };
  // const isRegisterComponent = {
  //   type: 'confirm',
  //   name: 'isRegister',
  //   message: uiText.messages.isRegisterComponent,
  //   when: () => (!inputProps.isRegister),
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
  //     return (!inputProps.packageName && isStatusAllowsSetupQuestion);
  //   },
  // };
  // const isAddComponentToStoryBook = {
  //   type: 'confirm',
  //   name: 'isAddComponentToStoryBook',
  //   message: uiText.messages.isAddComponentToStoryBook,
  //   when: () => (!inputProps.isAddComponentToStoryBook),
  // };

  // const defaultResolvers = {
  //   type: 'checkbox',
  //   name: 'defaultResolvers',
  //   message: 'Default resolvers',
  //   choices: [
  //     { name: 'List', value: 'list', checked: true },
  //     { name: 'Single', value: 'single', checked: true },
  //     { name: 'Total', value: 'total', checked: true },
  //   ],
  //   when: () => (!inputProps.defaultResolvers),
  //   filter: common.getSetFromArr,
  // };
  //


  // const isAddCustomSchemaProperty = {
  //   type: 'confirm',
  //   name: 'isAddCustomSchemaProperty',
  //   message: uiText.messages.IsAddCustomSchemaProperty,
  //   when: () => (!inputProps.IsAddCustomSchemaProperty),
  // };
  // const schemaPropertyName = {
  //   type: 'input',
  //   name: 'schemaPropertyName',
  //   message: uiText.messages.schemaPropertyName,
  //   // when: () => (!inputProps.schemaPropertyName),
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
  //   // when: () => (!inputProps.schemaPropertyType),
  // };
  // const isSchemaPropertyOptional = {
  //   type: 'confirm',
  //   name: 'isSchemaPropertyOptional',
  //   message: uiText.messages.isSchemaPropertyOptional,
  //   // when: () => (!inputProps.schemaPropertyType),
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
  //   // when: () => (!inputProps.IsAddCustomSchemaProperty),
  // };
  const questions = {
    appName,
    reactExtension,
    packageManager,
    packageName,
    vulcanDependencies,
    packageNameList,
    moduleName,
    moduleCreateWith,

    // moduleNameList,
    // isPackageAutoAdd,
    // componentName,
    // componentType,
    // isRegisterComponent,
    // storyBookSetup,
    // isAddComponentToStoryBook,
    // defaultResolvers,
    // isAddCustomSchemaProperty,
    // schemaPropertyName,
    // isSchemaPropertyHidden,
    // schemaPropertyLabel,
    // schemaPropertyType,
    // isSchemaPropertyOptional,
    // schemaPropertyViewableBy,
    // schemaPropertyInsertableBy,
    // schemaPropertyEditableBy,
    // isAddAnotherCustomSchemaProperty,
  };

  const boundQuestions = bindQuestions(questions);

  switch (questionName) {
    case 'appName': return boundQuestions.appName();
    case 'reactExtension': return boundQuestions.reactExtension();
    case 'packageName': return boundQuestions.packageName();
    case 'packageManager': return boundQuestions.packageManager();
    case 'vulcanDependencies': return boundQuestions.vulcanDependencies();
    case 'packageNameList': return boundQuestions.packageNameList();
    case 'moduleName': return boundQuestions.moduleName();
    case 'moduleCreateWith': return boundQuestions.moduleCreateWith();
    default: return undefined;
  }

  // return questions[questionName];
}

module.exports = {
  get: get
};
