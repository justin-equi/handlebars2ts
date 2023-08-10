import { textToIntf } from "./textToIntf";

export function makeTemplate(name: string, template: string) {
	return `
import {compile} from 'handlebars';

export const ${name} = compile<${textToIntf(template)}>(${JSON.stringify(
		template,
	)});
export default ${name};
  `;
}
