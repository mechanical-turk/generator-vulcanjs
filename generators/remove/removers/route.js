const VulcanGenerator = require('../../../lib/VulcanGenerator');
const ast = require('../../../lib/ast');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
  }

  _registerArguments() {
    //TODO: add arguments for remove
  }

  prompting() {
    if (!this._canPrompt()) {
      return false;
    }
    const questions = this._getQuestions('packageNameWithNumModulesList', 'routeName');
    return this.prompt(questions).then(answers => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        routeName: this._finalize('raw', 'routeName', answers)
      };
    });
  }

  writing() {
    if (!this._canWrite()) {
      return false;
    }
    const routesPath = this._getPath({ isAbsolute: true }, 'routes');
    const oldRoutes = this.fs.read(routesPath);
    const newRoutes = ast.removeRoute(oldRoutes, this.props.routeName);
    this.fs.write(routesPath, newRoutes);
    return true;
  }

  end() {
    this._end();
  }
};
