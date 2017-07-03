const Redux = require('redux');

const modules = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_MODULE': {
      const partialNext = {};
      partialNext[action.moduleName] = {};
      return Object.assign(
        {},
        partialNext,
        state,
      );
    }
    default: return state;
  }
}

function getEmptyPackage() {
  return {
    modules: {},
  };
}

const packages = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PACKAGE': {
      const partialNext = {};
      partialNext[action.packageName] = getEmptyPackage();
      return Object.assign(
        partialNext,
        state,
      );
    }

    case 'ADD_MODULE': {
      const thePackage = state[action.packageName] ?
        state[action.packageName] :
        getEmptyPackage();
      const packageWithModule = modules(thePackage, action);
      const partialNext = {};
      partialNext[action.packageName] = packageWithModule;
      return Object.assign(
        {},
        state,
        partialNext
      );
    }
    default: return state;
  }
}

const appName = (state = '', action) => {
  switch (action.type) {
    default: return state;
  }
}

const isVulcan = (state = false, action) => {
  switch (action.type) {
    default: return state;
  }
}

const packageManager = (state = 'yarn', action) => {
  switch (action.type) {
    default: return state;
  }
}

const reducers = Redux.combineReducers({
  appName: appName,
  isVulcan: isVulcan,
  packageManager: packageManager,
  packages: packages,
});

module.exports = reducers;
