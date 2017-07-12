const pascalCase = require('pascal-case');
const camelCase = require('camelcase');
const filter = require('./filters').filter;
const pathFinder = require('./path-finder');
const store = require('./store');

let generator;

function setup (generatorSetup) {
  generator = generatorSetup;
}

const arrayToEjsString = (arr) => {
  const quotedList = arr.map((elem) => `'${elem}'`);
  const quotedAndCsv = quotedList.join(',');
  return `[${quotedAndCsv}]`;
};

function finalize (propName, ...args) {
  function getRaw (keyBeforeRaw, answers) {
    return (
      generator.options[keyBeforeRaw] ||
      (generator.props ? generator.props[keyBeforeRaw] : undefined) ||
      answers[keyBeforeRaw]
    );
  }

  function permissionTo (permissionType, answers) {
    const permissionsArr = answers[permissionType];
    return arrayToEjsString(permissionsArr);
  }

  function appName (answers) {
    const appNameRaw = getRaw.bind(this)('appName', answers);
    return filter('appName', appNameRaw);
  }

  function packageName (answers) {
    const packageNameRaw = getRaw('packageName', answers);
    return filter('packageName', packageNameRaw);
  }

  function modelName (answers) {
    const modelNameRaw = getRaw('modelName', answers);
    return filter('modelName', modelNameRaw);
  }

  function componentName (answers) {
    const componentNameRaw = getRaw('componentName', answers);
    return filter('componentName', componentNameRaw);
  }

  function componentFileName (answers) {
    const filteredComponentName = filter('componentName', answers.componentName);
    return `${filteredComponentName}.${store.get('reactExtension')}`;
  }

  function componentPath (answers) {
    return pathFinder.get(
      { isAbsolute: false },
      'modelInComponents',
      componentFileName(answers)
    );
  }

  function pascalModelName (answers) {
    const modelNameRaw = getRaw('modelName', answers);
    return pascalCase(modelNameRaw);
  }

  function camelModelName (answers) {
    const modelNameRaw = getRaw('modelName', answers);
    return camelCase(modelNameRaw);
  }

  function modelParts (answers) {
    return Object.keys(answers.modelParts);
  }

  function collectionName (answers) {
    return pascalModelName(answers);
  }

  function mutationName (mutationType, answers) {
    const modelNamePart = camelModelName(answers);
    return `${modelNamePart}${mutationType}`;
  }

  function permissionName (permission, answers) {
    const camelModelNamePart = camelModelName(answers);
    const permissionAppendage = permission.join('.');
    return `${camelModelNamePart}.${permissionAppendage}`;
  }

  function vulcanDependencies (answers) {
    const rawDependencies = getRaw('vulcanDependencies', answers);
    return rawDependencies.map((dep) => (`'${dep}'`));
  }

  function resolverName (resolverType, answers) {
    const resolverNamePart = camelModelName(answers);
    return `${resolverNamePart}${resolverType}`;
  }

  function hasResolver (resolverType, answers) {
    const defaultResolvers = getRaw('defaultResolvers', answers);
    return defaultResolvers[resolverType];
  }

  function addRouteStatement (answers) {
    const routeName = getRaw('routeName', answers);
    const routePath = getRaw('routePath', answers);
    const layoutName = getRaw('layoutName', answers);
    const routeComponentName = componentName(answers);
    return `addRoute({
      name: '${routeName}',
      path: '${routePath}',
      component: Components.${routeComponentName},
      layoutName: '${layoutName}',
    });`;
  }

  switch (propName) {
    case 'appName' : return appName(...args);
    case 'packageName' : return packageName(...args);
    case 'modelName' : return modelName(...args);
    case 'modelParts': return modelParts(...args);
    case 'componentName' : return componentName(...args);
    case 'componentFileName' : return componentFileName(...args);
    case 'componentPath' : return componentPath(...args);
    case 'pascalModelName' : return pascalModelName(...args);
    case 'camelModelName' : return camelModelName(...args);
    case 'collectionName' : return collectionName(...args);
    case 'mutationName' : return mutationName(...args);
    case 'permissionName' : return permissionName(...args);
    case 'vulcanDependencies' : return vulcanDependencies(...args);
    case 'resolverName' : return resolverName(...args);
    case 'hasResolver' : return hasResolver(...args);
    case 'addRouteStatement' : return addRouteStatement(...args);
    case 'permissionTo': return permissionTo(...args);
    case 'raw' : return getRaw(...args);
    default: return undefined;
  }
}

module.exports = {
  setup,
  finalize,
};
