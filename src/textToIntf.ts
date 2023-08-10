import { parseWithoutProcessing } from "handlebars";
import { isProgram, isBlockStatement, isPathExpression, isMustacheStatement,  } from "./guards";
import { HasType } from "./types";

const parseHandlebarsVariables = (input = '') =>
  handleStatement(parseWithoutProcessing(input), {});

type Tree = { array?: boolean, name: string; tree?:Record<string, Tree>}

function makeTree(tree: Tree, names?: string[], array?:boolean) {
  if (!(names && names.length)) return tree;
  let current: Tree = tree;
  let i=0;
  for(const name of names){
  if (!current.tree) {
      current.tree = {};
    }
    current = (current.tree[name] ?? (current.tree[name] = {name}))
  }
  if (array) {
    current.array = true;
  }
  return current;
}
const handleStatement = (statement: HasType, tree:Tree = {name:'root'}) => {
   if (isProgram(statement)) {
    statement.body.forEach((statement) => handleStatement(statement, tree));
   } else if (isBlockStatement(statement)) {
     if (isProgram(statement.program)) {
       const p = statement.params[0]
       if (isPathExpression(p)) {
         handleStatement(statement.program, makeTree(tree, p.parts, true));
       } else throw new Error(`unknown grammer`);
     } else {
       statement.params?.filter(isPathExpression).forEach((v) => {
         if ('program' in v && isProgram(v.program)) {
           handleStatement(v.program, tree);
         } else {
           return makeTree(tree, v.parts)
         }
       });
     }
    
  } else if (isMustacheStatement(statement) && isPathExpression(statement.path)) {
        return makeTree(tree,  statement.path.parts)
  }
  return tree;
};


function keyValues(type: Tree, depth = 0) {
    const padOut = ''.padEnd(depth+1, '\t');
  let ret = ''
  for (const [name, tree] of Object.entries(type.tree ?? {})) {
    if (tree.tree) {
      ret += `${padOut}${name}: {\n${keyValues(tree, depth+1)}${padOut}}${tree.array ? '[]\n' : '\n'}`
    } else {
      ret += `${padOut}${name}: string;\n`;
    }
  }
  return ret;
}

function generate(type: Tree, depth = 0) {
  const pad = ''.padEnd(depth, '\t');
  return`${pad}{\n${keyValues(type, depth)}${pad}}`;  
}

export function textToIntf(str: string) {
  return generate(parseHandlebarsVariables(str));
}

