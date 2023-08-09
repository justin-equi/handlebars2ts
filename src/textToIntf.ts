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




function generate(type: Tree, depth = 1) {
  const pad = ''.padEnd(depth, '\t');

  let ret = `{\n`;
  for (const [name, tree] of Object.entries(type.tree ?? {})) {
    if (tree.tree) {
      ret += `${pad}${name}: ${generate(tree, depth + 1)}${tree.array ? '[]\n' : '\n'}`
    } else {
      ret += `${pad}${name}: string;\n`;
    }
  }
  ret += `}`;
  return ret;
}

export function textToIntf(str: string) {
  return generate(parseHandlebarsVariables(str));
}
