const beautify = require('gulp-beautify');
const dashify = require('dashify');

module.exports = {
  beautify: function() {
    this.registerTransformStream(
      beautify({indent_size: 2 })
    );
  },
  filterPackageName: function(packageName) {
    return dashify(packageName);
  }
};
