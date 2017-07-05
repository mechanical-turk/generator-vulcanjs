var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const esprima = require('esprima');
const escodegen = require('escodegen');

const getLastImportIndex = tree => {
  let lastIndex = -1;
  tree.body.forEach((node, index) => {
    if (node.type === 'ImportDeclaration') {
      lastIndex = index;
    }
  });
  return lastIndex;
};

const addImportStatement = (tree, statement) => {
  const newTree = _extends({}, tree);
  const nextImportIndex = getLastImportIndex(tree) + 1;
  const importNode = esprima.parseModule(statement);
  newTree.body = [...[...tree.body].slice(0, nextImportIndex), importNode.body[0], ...[...tree.body].slice(nextImportIndex, newTree.body.length)];
  return newTree;
};

const addImportStatementAndParse = (fileText, statement) => {
  const fileAst = esprima.parseModule(fileText);
  const fileAstWithImport = addImportStatement(fileAst, statement);
  const fileWithImport = escodegen.generate(fileAstWithImport);
  return fileWithImport;
};

module.exports = {
  getLastImportIndex: getLastImportIndex,
  addImportStatement: addImportStatement,
  addImportStatementAndParse: addImportStatementAndParse
};
//# sourceMappingURL=ast.js.map
