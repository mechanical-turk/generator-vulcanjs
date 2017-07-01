const Generator = require('yeoman-generator');
const beautify = require('gulp-beautify');

module.exports = class extends Generator {
  initializing() {
    this.registerTransformStream(beautify({indent_size: 2 }));
    // this.composeWith(require.resolve('../package'));
    // this.composeWith(require.resolve('../component'));
    this.composeWith(require.resolve('../module'));
  }
};
