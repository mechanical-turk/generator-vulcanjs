const dashify = require('dashify');
const camelCase = require('camelcase');

function packageName (toFilter) {
  return dashify(toFilter);
}

function appName (toFilter) {
  return dashify(toFilter);
}

function moduleName (toFilter) {
  return camelCase(toFilter);
}

function filter (filterType, toFilter) {
  switch (filterType) {
    case 'packageName' : return packageName(toFilter);
    case 'appName' : return appName(toFilter);
    case 'moduleName' : return moduleName(toFilter);
    default : return toFilter;
  }
}

module.exports = {
  filter,
};
