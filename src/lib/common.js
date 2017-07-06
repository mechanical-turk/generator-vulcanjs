const alphabeticalSort = (a, b) => {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  if (aLower < bLower) return -1;
  if (aLower > bLower) return 1;
  return 0;
};

const getSetFromArr = (arr) => {
  const set = {};
  arr.forEach((elem) => {
    set[elem] = true;
  });
  return set;
};

const reactExtensions = ['jsx', 'js'];

const packageManagers = ['yarn', 'npm'];

const getDefaultChoiceIndex = (choices, option) => {
  const index = choices.findIndex((elem) => elem === option);
  return Math.max(index, 0);
};

const exposed = {
  alphabeticalSort,
  reactExtensions,
  packageManagers,
  getDefaultChoiceIndex,
  getSetFromArr,
};

module.exports = exposed;
