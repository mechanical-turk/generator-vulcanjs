'use strict';

const Redux = require('redux');

const moduleReducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  };
};

const modulesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_MODULE':
      {
        const partialNext = {};
        partialNext[action.moduleName] = moduleReducer(undefined, {});
        return Object.assign({}, state, partialNext);
        return nextState;
      }
    default:
      return state;
  }
};

const packageReducer = (state = { modules: {} }, action) => {
  switch (action.type) {
    case 'ADD_MODULE':
      {
        const prevModules = state.modules;
        const nextModules = modulesReducer(prevModules, action);
        return Object.assign({}, state, { modules: nextModules });
      }
    default:
      {
        return state;
      };
  }
};

const packagesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PACKAGE':
      {
        const partialNext = {};
        partialNext[action.packageName] = packageReducer(undefined, {});
        return Object.assign({}, state, partialNext);
      }

    case 'ADD_MODULE':
      {
        const prevPackage = state[action.packageName];
        const partialNext = {};
        partialNext[action.packageName] = packageReducer(prevPackage, action);
        return Object.assign({}, state, partialNext);
      }
    default:
      return state;
  }
};

const appName = (state = '', action) => {
  switch (action.type) {
    case 'SET_APP_NAME':
      return action.appName;
    default:
      return state;
  }
};

const isVulcan = (state = false, action) => {
  switch (action.type) {
    case 'SET_IS_VULCAN':
      return true;
    default:
      return state;
  }
};

const packageManager = (state = 'yarn', action) => {
  switch (action.type) {
    case 'SET_PACKAGE_MANAGER':
      return action.packageManager;
    default:
      return state;
  }
};

const reactExtension = (state = 'jsx', action) => {
  switch (action.type) {
    case 'SET_REACT_EXTENSION':
      return action.reactExtension;
    default:
      return state;
  }
};

const reducers = Redux.combineReducers({
  appName: appName,
  isVulcan: isVulcan,
  packageManager: packageManager,
  packages: packagesReducer,
  reactExtension: reactExtension
});

module.exports = reducers;
