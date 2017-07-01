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
    }]).then((answers) => {
      this.props = answers;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('package.js'),
      this.destinationPath(`packages/${this.props.packageName}/package.js`),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('client.js'),
      this.destinationPath(`packages/${this.props.packageName}/lib/client/main.js`),
    );
    this.fs.copyTpl(
      this.templatePath('server.js'),
      this.destinationPath(`packages/${this.props.packageName}/lib/server/main.js`),
    );
    this.fs.copyTpl(
      this.templatePath('seed.js'),
      this.destinationPath(`packages/${this.props.packageName}/lib/server/seed.js`),
    );
    this.fs.copyTpl(
      this.templatePath('module.js'),
      this.destinationPath(`packages/${this.props.packageName}/lib/modules/index.js`),
    );
    this.fs.copyTpl(
      this.templatePath('routes.js'),
      this.destinationPath(`packages/${this.props.packageName}/lib/modules/routes.js`),
    );
  }
};
