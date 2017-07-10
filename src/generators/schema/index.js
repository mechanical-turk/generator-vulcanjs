const VulcanGenerator = require('../../lib/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing () {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
  }

  _registerArguments () {
    this._registerOptions(
      'packageName',
      'moduleName'
    );
  }

  prompting () {
    if (!this._canPrompt()) { return false; }
    const questions = this._getQuestions(
      'packageNameWithNumModulesList',
      'moduleNameList',
      'isAddCustomSchemaProperty'
    );
    return this.prompt(questions)
    .then((answers) => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        moduleName: this._finalize('moduleName', answers),
        isAddCustomSchemaProperty: this._finalize('raw', 'isAddCustomSchemaProperty', answers),
        customSchemaProperties: [],
      };
      if (this.props.isAddCustomSchemaProperty) {
        return this._askCustomSchemaQuestion();
      }
    });
  }

  _askCustomSchemaQuestion () {
    const customSchemaPropertyQuestions = this._getQuestions(
      'schemaPropertyName',
      'isSchemaPropertyHidden',
      'schemaPropertyLabel',
      'schemaPropertyType',
      'isSchemaPropertyOptional',
      'schemaPropertyViewableBy',
      'schemaPropertyInsertableBy',
      'schemaPropertyEditableBy',
      'isAddAnotherCustomSchemaProperty'
    );
    return this.prompt(customSchemaPropertyQuestions)
    .then((answers) => {
      const customSchemaProperties = {
        name: this._finalize('raw', 'schemaPropertyName', answers),
        isHidden: this._finalize('raw', 'isSchemaPropertyHidden', answers),
        label: this._finalize('raw', 'schemaPropertyLabel', answers),
        type: this._finalize('raw', 'schemaPropertyType', answers),
        isOptional: this._finalize('raw', 'isSchemaPropertyOptional', answers),
        viewableBy: this._finalize('permissionTo', 'schemaPropertyViewableBy', answers),
        insertableBy: this._finalize('permissionTo', 'schemaPropertyInsertableBy', answers),
        editableBy: this._finalize('permissionTo', 'schemaPropertyEditableBy', answers),
      };
      this.props.customSchemaProperties.push(customSchemaProperties);
      if (answers.isAddAnotherCustomSchemaProperty) {
        return this._askCustomSchemaQuestion();
      }
    });
  }

  _writeSchema () {
    this.fs.copyTpl(
      this.templatePath('schema.js'),
      this._getPath(
        { isAbsolute: true },
        'module',
        'schema.js'
      ),
      this.props
    );
  }

  _writeTestSchema () {
    const testFragmentsProps = {
      ...this.props,
      subjectName: 'schema',
      subjectPath: '../schema',
    };
    this.fs.copyTpl(
      this.templatePath('test.js'),
      this._getPath(
        { isAbsolute: true },
        'moduleTest',
        'schema.js'
      ),
      testFragmentsProps
    );
  }

  writing () {
    if (!this._canWrite()) { return; }
    this._writeSchema();
    this._writeTestSchema();
  }

  end () {
    this._end();
  }
};
