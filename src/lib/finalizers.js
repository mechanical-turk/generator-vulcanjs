const pascalCase = require('pascal-case');
const camelCase = require('camelcase');
const filter = require('./filters').filter;

let generator;

function setup (generatorSetup) {
  generator = generatorSetup;
}

function finalize (propName, ...args) {
  function getRaw (keyBeforeRaw, answers) {
    return (
      generator.inputProps[keyBeforeRaw] ||
      (generator.props ? generator.props[keyBeforeRaw] : undefined) ||
      answers[keyBeforeRaw]
    );
  }

  function appName (answers) {
    const appNameRaw = getRaw.bind(this)('appName', answers);
    return filter('appName', appNameRaw);
  }

  function packageName (answers) {
    const packageNameRaw = getRaw('packageName', answers);
    return filter('packageName', packageNameRaw);
  }

  function moduleName (answers) {
    const moduleNameRaw = getRaw('moduleName', answers);
    return filter('moduleName', moduleNameRaw);
  }

  function pascalModuleName (answers) {
    const moduleNameRaw = getRaw('moduleName', answers);
    return pascalCase(moduleNameRaw);
  }

  function camelModuleName (answers) {
    const moduleNameRaw = getRaw('moduleName', answers);
    return camelCase(moduleNameRaw);
  }

  function collectionName (answers) {
    return pascalModuleName(answers);
  }

  function mutationName (mutationType, answers) {
    const moduleNamePart = camelModuleName(answers);
    return `${moduleNamePart}${mutationType}`;
  }

  function permissionName (permission, answers) {
    const camelModuleNamePart = camelModuleName(answers);
    const permissionAppendage = permission.join('.');
    return `${camelModuleNamePart}.${permissionAppendage}`;
  }

  function vulcanDependencies (answers) {
    const rawDependencies = getRaw('vulcanDependencies', answers);
    return rawDependencies.map((dep) => (`'${dep}'`));
  }

  function resolverName (resolverType, answers) {
    const resolverNamePart = camelModuleName(answers);
    return `${resolverNamePart}${resolverType}`;
  }

  function hasResolver (resolverType, answers) {
    const defaultResolvers = getRaw('defaultResolvers', answers);
    return defaultResolvers[resolverType];
  }

  switch (propName) {
    case 'appName' : return appName(...args);
    case 'packageName' : return packageName(...args);
    case 'moduleName' : return moduleName(...args);
    case 'pascalModuleName' : return pascalModuleName(...args);
    case 'camelModuleName' : return camelModuleName(...args);
    case 'collectionName' : return collectionName(...args);
    case 'mutationName' : return mutationName(...args);
    case 'permissionName' : return permissionName(...args);
    case 'vulcanDependencies' : return vulcanDependencies(...args);
    case 'resolverName' : return resolverName(...args);
    case 'hasResolver' : return hasResolver(...args);
    case 'raw' : return getRaw(...args);
    default: return undefined;
  }
}

module.exports = {
  setup,
  finalize,
};
