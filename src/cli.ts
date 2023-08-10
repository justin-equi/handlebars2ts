#!/usr/bin/env node
import { glob } from 'glob'
import { readFile, writeFile } from 'fs/promises';
import { makeTemplate } from './makeTemplate';


export async function main(files = 'templates/**/*.hbs', ...rest: string[]) {
    if (/--help|-h/.test(files)) {
        console.warn(`handlebars2ts <glob  of files to transform>`);
        return 
    }
    const resolved = await glob([files, ...rest])

    await Promise.all(resolved.map(async (file) => {
       const src = await readFile(file);
       const out = `${file}.ts`;
       await writeFile(out, makeTemplate(src + ''));
       console.log(`writing ${out}.ts`);
        return out;
    }));
}

if (require.main) {
    main(...process.argv.slice(2));
}