import { Visitor, parseWithoutProcessing } from "handlebars";
import { isProgram, isBlockStatement, isPathExpression, isMustachStatement,  } from "./guards";
import { HasType } from "./types";

const parseHandlebarsVariables = (input = '') =>
  handleStatement(parseWithoutProcessing(input), new Set<string[]>());

const handleStatement = (statement: HasType, keys: Set<string[]> = new Set(), current: string[] = []) => {
  if (isProgram(statement)) {
    statement.body.reduce((ret, statement) => handleStatement(statement, ret, current), keys);
  } else if (isBlockStatement(statement)) {
    statement.params?.filter(isPathExpression).forEach((v) => {
      if ('program' in v && isProgram(v.program)) {
        handleStatement(v.program, keys, v.parts);
      } else {
        keys.add(current.concat(...v.parts));
      }
    });
  } else if (isMustachStatement(statement) && isPathExpression(statement.path)) {
    keys.add(current.concat(...statement.path.parts));
  }
  return keys;
};




function generate(type: Iterable<string[]>) {
  let ret = '{\n';
  for (const paths in type) {
    if (paths.length === 1) {
      ret += `${paths[0]}:string;\n`;
    } else {
      const [key, ...rest] = paths;
      const dec = generate([rest]);
      ret += `${key}:(${dec} | ${dec}[])\n`;
    }
  }
  ret += '}';
  return ret;
}

export function textToIntf(str: string) {
  return generate(parseHandlebarsVariables(str));
}
