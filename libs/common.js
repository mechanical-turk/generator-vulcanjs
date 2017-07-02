const beautify = require('gulp-beautify');

module.exports = {
  beautify: function() {
    this.registerTransformStream(
      beautify({indent_size: 2 })
    );
  },
};
