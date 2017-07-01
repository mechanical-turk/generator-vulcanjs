const Generator = require('yeoman-generator');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'packageName',
      message: 'Package name',
    }, {
      type: 'checkbox',
      name: 'dependencies',
      message: 'Vulcan dependencies',
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
    const packageSubPath = path.join('packages', this.props.packageName);
    const libSubPath = path.join(packageSubPath, 'lib');
    this.fs.copyTpl(
      this.templatePath('package.js'),
      this.destinationPath(packageSubPath, 'package.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('client.js'),
      this.destinationPath(libSubPath, 'client', 'main.js')
    );
    this.fs.copyTpl(
      this.templatePath('server.js'),
      this.destinationPath(libSubPath, 'server', 'main.js')
    );
    this.fs.copyTpl(
      this.templatePath('seed.js'),
      this.destinationPath(libSubPath, 'server', 'seed.js')
    );
    this.fs.copyTpl(
      this.templatePath('module.js'),
      this.destinationPath(libSubPath, 'modules', 'index.js')
    );
    this.fs.copyTpl(
      this.templatePath('routes.js'),
      this.destinationPath(libSubPath, 'modules', 'routes.js')
    );
  }
};
