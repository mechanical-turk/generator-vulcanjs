const path = require('path');

let generator;

function setup(generatorSetup) {
  generator = generatorSetup;
}

function get(wrappedOptions, pathType, ...wrappedArgs) {
  function getPath(options, ...args) {
    const relativeToProjectRootPath = path.join(...args);
    const absolutePath = generator.destinationPath(relativeToProjectRootPath);
    if (options.relativeTo) return path.relative(options.relativeTo, absolutePath);
    return options.isAbsolute ? absolutePath : relativeToProjectRootPath;
  }

  function rootStoriesPath(options, ...args) {
    return getPath(options, '.stories', ...args);
  }

  function packagePath(options, ...args) {
    return getPath(options, 'packages', generator.props.packageName, ...args);
  }

  function libPath(options, ...args) {
    return packagePath(options, 'lib', ...args);
  }

  function modulesPath(options, ...args) {
    return libPath(options, 'modules', ...args);
  }

  function routesPath(options) {
    return modulesPath(options, 'routes.js');
  }

  function modulePath(options, ...args) {
    return modulesPath(options, generator.props.moduleName, ...args);
  }

  function componentsPath(options, ...args) {
    return libPath(options, 'components', ...args);
  }

  function moduleTestPath(options, ...args) {
    return modulePath(options, 'test', ...args);
  }

  function packageStoriesPath(options, ...args) {
    return componentsPath(options, '.stories.js', ...args);
  }

  function moduleInComponentsPath(options, ...args) {
    return componentsPath(options, generator.props.moduleName, ...args);
  }

  function moduleStoriesPath(options) {
    return moduleInComponentsPath(options, '.stories.js');
  }

  function clientPath(options, ...args) {
    return libPath(options, 'client', ...args);
  }

  function serverPath(options, ...args) {
    return libPath(options, 'server', ...args);
  }

  switch (pathType) {
    case 'rootStories':
      return rootStoriesPath(wrappedOptions, ...wrappedArgs);
    case 'package':
      return packagePath(wrappedOptions, ...wrappedArgs);
    case 'lib':
      return libPath(wrappedOptions, ...wrappedArgs);
    case 'modules':
      return modulesPath(wrappedOptions, ...wrappedArgs);
    case 'module':
      return modulePath(wrappedOptions, ...wrappedArgs);
    case 'components':
      return componentsPath(wrappedOptions, ...wrappedArgs);
    case 'moduleTest':
      return moduleTestPath(wrappedOptions, ...wrappedArgs);
    case 'packageStories':
      return packageStoriesPath(wrappedOptions, ...wrappedArgs);
    case 'moduleInComponents':
      return moduleInComponentsPath(wrappedOptions, ...wrappedArgs);
    case 'moduleStories':
      return moduleStoriesPath(wrappedOptions, ...wrappedArgs);
    case 'client':
      return clientPath(wrappedOptions, ...wrappedArgs);
    case 'server':
      return serverPath(wrappedOptions, ...wrappedArgs);
    case 'routes':
      return routesPath(wrappedOptions, ...wrappedArgs);
    default:
      return undefined;
  }
}

module.exports = {
  get: get,
  setup: setup
};
