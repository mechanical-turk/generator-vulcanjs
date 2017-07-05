const esprima = require('esprima');
const escodegen = require('escodegen');

const getLastImportIndex = (tree) => {
  let lastIndex = -1;
  tree.body.forEach((node, index) => {
    if (node.type === 'ImportDeclaration') {
      lastIndex = index;
    }
  });
  return lastIndex;
};

const addImportStatement = (tree, statement) => {
  const newTree = { ...tree };
  const nextImportIndex = getLastImportIndex(tree) + 1;
  const importNode = esprima.parseModule(statement);
  newTree.body = [
    ...[...tree.body].slice(0, nextImportIndex),
    importNode.body[0],
    ...[...tree.body].slice(nextImportIndex, newTree.body.length),
  ];
  return newTree;
};

const addImportStatementAndParse = (fileText, statement) => {
  const fileAst = esprima.parseModule(fileText, {
    jsx: true,
  });
  const fileAstWithImport = addImportStatement(fileAst, statement);
  const fileWithImport = escodegen.generate(fileAstWithImport);
  return fileWithImport;
};

module.exports = {
  getLastImportIndex,
  addImportStatement,
  addImportStatementAndParse,
};
