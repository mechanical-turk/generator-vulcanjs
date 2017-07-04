'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulpBeautify = require('gulp-beautify');

var _gulpBeautify2 = _interopRequireDefault(_gulpBeautify);

var _dashify = require('dashify');

var _dashify2 = _interopRequireDefault(_dashify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const beautify = function () {
  this.registerTransformStream((0, _gulpBeautify2.default)({ indent_size: 2 }));
};

const filterPackageName = packageName => {
  return (0, _dashify2.default)(packageName);
};

const alphabeticalSort = (a, b) => {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  if (aLower < bLower) return -1;
  if (aLower > bLower) return 1;
  return 0;
};

const descriptions = {
  appName: 'The name of your app',
  reactExtension: 'Default react component extension',
  packageManager: 'Preferred package manager',
  packageName: 'The name of the package',
  moduleName: 'The name of your module',
  vulcanDependencies: 'The vulcan packages that your application depends on',
  isPackageAutoAdd: 'Set to true if you want your package to be added to .meteor/packages'
};

const messages = {
  appName: 'App name',
  reactExtension: 'React extension',
  packageManager: 'Package manager',
  packageName: 'Package name',
  moduleName: 'Module name',
  vulcanDependencies: 'Vulcan dependencies',
  isPackageAutoAdd: 'Add to .meteor/packages'
};

const reactExtensions = ['jsx', 'js'];

const packageManagers = ['yarn', 'npm'];

const getDefaultChoiceIndex = (choices, option) => {
  const index = choices.findIndex(elem => elem === option);
  return Math.max(index, 0);
};

const exposed = {
  beautify: beautify,
  filterPackageName: filterPackageName,
  alphabeticalSort: alphabeticalSort,
  descriptions: descriptions,
  messages: messages,
  reactExtensions: reactExtensions,
  packageManagers: packageManagers,
  getDefaultChoiceIndex: getDefaultChoiceIndex
};

exports.default = exposed;
