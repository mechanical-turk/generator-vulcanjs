const gulpBeautify = require('gulp-beautify');

const beautify = function () {
  this.registerTransformStream(gulpBeautify({ indent_size: 2 }));
};

const alphabeticalSort = (a, b) => {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  if (aLower < bLower) return -1;
  if (aLower > bLower) return 1;
  return 0;
};

const getSetFromArr = arr => {
  const set = {};
  arr.forEach(elem => {
    set[elem] = true;
  });
  return set;
};

const descriptions = {
  appName: 'The name of your app',
  reactExtension: 'Default react component extension',
  packageManager: 'Preferred package manager',
  packageName: 'The name of the package',
  moduleName: 'The name of the module',
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
  isRegisterComponent: 'Register component',
  componentType: 'Component type',
  vulcanDependencies: 'Vulcan dependencies',
  isPackageAutoAdd: 'Add to .meteor/packages',
  storyBookSetupStatus: 'Looks like you havent set up your react storybook. Would you like to do it now?',
  isAddComponentToStoryBook: 'Add component to storybook'
};

const reactExtensions = ['jsx', 'js'];

const packageManagers = ['yarn', 'npm'];

const getDefaultChoiceIndex = (choices, option) => {
  const index = choices.findIndex(elem => elem === option);
  return Math.max(index, 0);
};

const exposed = {
  beautify: beautify,
  alphabeticalSort: alphabeticalSort,
  descriptions: descriptions,
  messages: messages,
  reactExtensions: reactExtensions,
  packageManagers: packageManagers,
  getDefaultChoiceIndex: getDefaultChoiceIndex,
  getSetFromArr: getSetFromArr
};

module.exports = exposed;
//# sourceMappingURL=common.js.map
