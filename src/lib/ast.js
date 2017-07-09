const esprima = require('esprima');
const escodegen = require('escodegen-wallaby');

const getLastImportIndex = (tree) => {
  let lastIndex = -1;
  tree.body.forEach((node, index) => {
    if (node.type === 'ImportDeclaration') {
      lastIndex = index;
    }
  });
  return lastIndex;
};

const parseAst = (text) => (
  esprima.parseModule(text, {
    range: true,
    tokens: true,
    comment: true,
  })
);

const generateCode = (ast) => (
  escodegen.generate(
    ast,
    { comment: true, format: { indent: { style: '  ' } } }
  )
);

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
  const fileAst = parseAst(fileText);
  const fileAstWithImport = addImportStatement(fileAst, statement);
  const fileWithImport = generateCode(fileAstWithImport);
  return fileWithImport;
};

const appendCode = (tree, statement) => {
  const newTree = { ...tree };
  const newCodeAst = parseAst(statement);
  const codeToPush = newCodeAst.body[0];
  newTree.body.push(codeToPush);
  return newTree;
};

const appendCodeAndParse = (fileText, statement) => {
  const fileAst = parseAst(fileText);
  const fileAstWithAppendedCode = appendCode(fileAst, statement);
  const fileWithNewCode = generateCode(fileAstWithAppendedCode);
  return fileWithNewCode;
};

module.exports = {
  getLastImportIndex,
  addImportStatementAndParse,
  appendCodeAndParse,
};
