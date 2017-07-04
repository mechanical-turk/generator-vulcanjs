import Redux from 'redux';

const moduleReducer = (state = {}, action) => {
  switch (action.type) {
    default: return state;
  }
};

const modulesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_MODULE': {
      const partialNext = {};
      partialNext[action.moduleName] = moduleReducer(undefined, {});
      return {
        ...state,
        ...partialNext,
      };
    }
    default: return state;
  }
};

const packageReducer = (state = { modules: {} }, action) => {
  switch (action.type) {
    case 'ADD_MODULE': {
      const prevModules = state.modules;
      return {
        ...state,
        modules: modulesReducer(prevModules, action),
      };
    }
    default: return state;
  }
};

const packagesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PACKAGE': {
      const partialNext = {};
      partialNext[action.packageName] = packageReducer(undefined, {});
      return {
        ...state,
        ...partialNext,
      };
    }

    case 'ADD_MODULE': {
      const prevPackage = state[action.packageName];
      const partialNext = {};
      partialNext[action.packageName] = packageReducer(
        prevPackage,
        action
      );
      return {
        ...state,
        ...partialNext,
      };
    }
    default: return state;
  }
};

const appName = (state = '', action) => {
  switch (action.type) {
    case 'SET_APP_NAME': return action.appName;
    default: return state;
  }
};

const isVulcan = (state = false, action) => {
  switch (action.type) {
    case 'SET_IS_VULCAN': return true;
    default: return state;
  }
};

const packageManager = (state = 'yarn', action) => {
  switch (action.type) {
    case 'SET_PACKAGE_MANAGER': return action.packageManager;
    default: return state;
  }
};

const reactExtension = (state = 'jsx', action) => {
  switch (action.type) {
    case 'SET_REACT_EXTENSION': return action.reactExtension;
    default: return state;
  }
};

const reducers = Redux.combineReducers({
  appName,
  isVulcan,
  packageManager,
  reactExtension,
  packages: packagesReducer,
});

export default reducers;
