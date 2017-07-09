const chalk = require('chalk');

const descriptions = {
  appName: 'The name of your app',
  reactExtension: 'Default react component extension',
  packageManager: 'Preferred package manager',
  packageName: 'The name of the package',
  moduleName: 'The name of the module',
  componentName: 'The name of your component',
  isRegisterComponent: 'Set to true of you want to register the component to Vulcan.',
  isAddComponentToStoryBook: 'Set to true of you want to add the component to storybook.',
  componentType: 'The type of the component. Is it a pure function, or a class?',
  vulcanDependencies: 'The vulcan packages that your application depends on',
  isPackageAutoAdd: 'Set to true if you want your package to be added to .meteor/packages'
};

const messages = {
  appName: 'App name',
  reactExtension: 'React extension',
  packageManager: 'Package manager',
  packageName: 'Package name',
  moduleName: 'Module name',
  componentName: 'Component name',
  isRegisterComponent: 'Register component',
  componentType: 'Component type',
  routeName: 'Route name',
  routePath: 'Route path',
  layoutName: 'Layout name',
  vulcanDependencies: 'Vulcan dependencies',
  isPackageAutoAdd: 'Add to .meteor/packages',
  storyBookSetupStatus: 'Looks like you havent set up your react storybook. Would you like to do it now?',
  isAddComponentToStoryBook: 'Add component to storybook',
  isAddCustomSchemaProperty: 'Add a custom property to the collection',
  isAddAnotherCustomSchemaProperty: 'Add another custom property to the collection',
  schemaPropertyName: 'Property name',
  isSchemaPropertyHidden: 'Property is hidden',
  schemaPropertyLabel: 'Property label',
  schemaPropertyType: 'Property type',
  isSchemaPropertyOptional: 'Property is optional',
  schemaPropertyViewableBy: 'Property viewable by',
  schemaPropertyInsertableBy: 'Property insertable by',
  schemaPropertyEditableBy: 'Property editable by'
};

const errors = {
  notVulcan: 'This is not a Vulcan.js project directory. \nYou cannot run Vulcan.js generators outside of a Vulcan.js project directory.',
  isVulcan: 'You are already in a Vulcan.js project directory. \nYou may not run this command inside a Vulcan.js project directory.',
  notPackageExists: packageName => `The package ${packageName} does not exist. \nIf you'd like to work on this package, you should create it first by running: ${chalk.green(`vulcanjs:package ${packageName}`)}`,
  isPackageExists: packageName => `A package with the name: '${packageName}' already exists.`,
  notModuleExists: (packageName, moduleName) => `A module with the name: '${moduleName}' under the package '${packageName}' does not exist. \nIf you'd like to work on this module, you should first run ${chalk.green(`vulcanjs:module --p ${packageName} --m ${moduleName}`)}.`,
  isModuleExists: (packageName, moduleName) => `A module with the name '${moduleName}' under the package '${packageName}' already exists.`,
  isZeroPackages: `The command you just ran requires at least 1 custom package to be present in your app. \nTo create a package, run ${chalk.green('vulcanjs:package')}`,
  hasZeroModules: packageName => `The package '${packageName} has no modules.)}`,
  isEmpty: 'This cannot be empty.'
};

module.exports = {
  descriptions: descriptions,
  messages: messages,
  errors: errors
};