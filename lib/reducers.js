var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const Redux = require('redux');

const moduleReducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const modulesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_MODULE':
      {
        const partialNext = {};
        partialNext[action.moduleName] = moduleReducer(undefined, {});
        return _extends({}, state, partialNext);
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
        return _extends({}, state, {
          modules: modulesReducer(prevModules, action)
        });
      }
    default:
      return state;
  }
};

const packagesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PACKAGE':
      {
        const partialNext = {};
        partialNext[action.packageName] = packageReducer(undefined, {});
        return _extends({}, state, partialNext);
      }

    case 'ADD_MODULE':
      {
        const prevPackage = state[action.packageName];
        const partialNext = {};
        partialNext[action.packageName] = packageReducer(prevPackage, action);
        return _extends({}, state, partialNext);
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
    case 'SET_IS_VULCAN_TRUE':
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

const storyBookStatusReducer = (state = 'pending', action) => {
  switch (action.type) {
    case 'SET_STORYBOOK_PENDING':
      return 'pending';
    case 'SET_STORYBOOK_INSTALLING':
      return 'installing';
    case 'SET_STORYBOOK_DONT_ASK':
      return 'dontask';
    case 'SET_STORYBOOK_INSTALLED':
      return 'installed';
    default:
      return state;
  }
};

const reducers = Redux.combineReducers({
  appName: appName,
  isVulcan: isVulcan,
  packageManager: packageManager,
  reactExtension: reactExtension,
  storyBookStatus: storyBookStatusReducer,
  packages: packagesReducer
});

module.exports = reducers;
//# sourceMappingURL=reducers.js.map
