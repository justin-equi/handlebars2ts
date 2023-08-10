import { expect, it } from "vitest";
import { makeTemplate } from "./makeTemplate";
import { CompilerOptions, ModuleKind, transpileModule } from "typescript";
import vm from 'node:vm';
import type { Context } from 'node:vm';

function transpile(
	source: string,
	compilerOptions: CompilerOptions = { module: ModuleKind.CommonJS },
) {
	return transpileModule(source, { compilerOptions }).outputText;
}
it("should make a nice template", () => {
	expect(makeTemplate("helloWorld", `hello, {{{name}}}!`)).toMatchSnapshot();
});

it("should compile", function () {
    const code = transpile(makeTemplate("helloWorld", `hello, {{{name}}}!`))
    const result = new vm.Script(code, {
        filename: 'sampletest.mjs',
    }).runInNewContext({
        ModuleKind: ModuleKind.CommonJS,
        displayErrors: true,
        require,
        console,
        import: {},
        module: {},
        exports: {},

    })
    expect(result({ name: 'Bob' })).toEqual('hello, Bob!');
});

