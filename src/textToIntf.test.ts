import { expect, describe, it } from 'vitest';
import { textToIntf } from './textToIntf';

describe('textToIntf', function () {
    it('should parse simple type', function () {
        expect(textToIntf('{{name}}}')).toMatchSnapshot();
    })

});