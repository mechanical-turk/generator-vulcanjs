const Generator = require('yeoman-generator');
const beautify = require('gulp-beautify');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this.registerTransformStream(beautify({indent_size: 2 }));
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'packageName',
      message: 'Your package name',
    }, {
      type: 'checkbox',
      name: 'dependencies',
      message: 'Which of the following vulcan packages should your package depend on?',
      choices: [
        { name: 'vulcan:core', checked: true },
        'vulcan:posts',
        'vulcan:comments',
        'vulcan:newsletter',
        'vulcan:notifications',
        'vulcan:getting-started',
        'vulcan:categories',
        'vulcan:voting',
        'vulcan:embedly',
        'vulcan:api',
        'vulcan:rss',
        'vulcan:subscribe',
      ],
    }, {
      type: 'input',
      name: 'serverEntryPoint',
      message: 'Server entry point',
      default: 'lib/server/main.js',
    }, {
      type: 'input',
      name: 'clientEntryPoint',
      message: 'Client entry point',
      default: 'lib/client/main.js',
    }]).then((props) => {
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('package.js'),
      this.destinationPath(`packages/${this.props.packageName}/package.js`),
      this.props
    );
  }
};
