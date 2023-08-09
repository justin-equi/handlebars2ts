import { expect, describe, it } from 'vitest';
import { textToIntf } from './textToIntf';

describe('textToIntf', function () {
    it('should parse simple type', function () {
        expect(textToIntf('{{{name}}}')).toMatchSnapshot();
    });
    it('should parse simple type multiple', function () {
        expect(textToIntf('stuff {{{name}}} {{{more}}}')).toMatchSnapshot();
    });
    it('should parse simple type loop', function () {
        expect(textToIntf('{{#each person}} is {{{this.name}}} {{/each}}')).toMatchSnapshot();
    });

});