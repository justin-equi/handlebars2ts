import { expect, it } from 'vitest';
import { makeTemplate } from './makeTemplate';
import {CompilerOptions, ModuleKind, transpileModule} from "typescript";
function transpile(source:string, compilerOptions: CompilerOptions = { module: ModuleKind.CommonJS }) {
  return transpileModule(source, { compilerOptions }).outputText;
}
it('should make a nice template', () => {
    expect(makeTemplate('helloWorld', `hello, {{{name}}}!`)).toMatchSnapshot(); 

});

it('should compile', function () {
    expect(transpile(makeTemplate('helloWorld', `hello, {{{name}}}!`))).toMatchSnapshot();
})

