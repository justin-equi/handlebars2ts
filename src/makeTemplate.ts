import { textToIntf } from "./textToIntf";

export function makeTemplate(template: string, name: string = '__default') {
	return `
import {compile} from 'handlebars';

export const ${name} = compile<${textToIntf(template)}>(${JSON.stringify(
		template,
	)});
export default ${name};
  `;
}
