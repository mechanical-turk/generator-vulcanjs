const beautify = require('gulp-beautify');
const dashify = require('dashify');

module.exports = {
  beautify: function() {
    this.registerTransformStream(
      beautify({indent_size: 2 })
    );
  },

  filterPackageName: (packageName) => {
    return dashify(packageName);
  },

  alphabeticalSort: (a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    if (aLower < bLower) return -1;
    if (aLower > bLower) return 1;
    return 0;
  },
};
