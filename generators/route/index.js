const VulcanGenerator = require('../../lib/VulcanGenerator');
const ast = require('../../lib/ast');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
  }

  _registerArguments() {
    this._registerOptions('packageName', 'moduleName');
  }

  prompting() {
    if (!this._canPrompt()) {
      return false;
    }
    const questions = this._getQuestions('packageNameWithNumModulesList', 'moduleNameList', 'routeName', 'routePath', 'componentName', 'layoutName'
    // ,'parentRoute'
    );
    return this.prompt(questions).then(answers => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        moduleName: this._finalize('moduleName', answers),
        componentName: this._finalize('componentName', answers),
        routeName: this._finalize('raw', 'routeName', answers),
        routePath: this._finalize('raw', 'routePath', answers),
        layoutName: this._finalize('raw', 'layoutName', answers),
        addRouteStatement: this._finalize('addRouteStatement', answers)
      };
    });
  }

  _updateRoutes() {
    const routesPath = this._getPath({ isAbsolute: true }, 'routes');

    const fileText = this.fs.read(routesPath);
    const fileTextWithWithImport = ast.appendCodeAndParse(fileText, this.props.addRouteStatement);
    this.fs.write(routesPath, fileTextWithWithImport);
  }

  writing() {
    if (!this._canWrite()) {
      return;
    }
    this._updateRoutes();
  }

  end() {
    this._end();
  }
};
