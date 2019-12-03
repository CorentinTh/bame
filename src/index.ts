import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const inReg = process.argv[2];
const outReg = process.argv[3];
const cwd = process.cwd()
console.log({ inReg, outReg, cwd });

const files = readdirSync(cwd).filter(n => !statSync(n).isDirectory());

files.forEach(file => {
    const matches = new RegExp(inReg).exec(file);

    if (matches) {
        const result = outReg.replace(/{([0-9]+)}/g, (_, i: string) => {
            return matches[parseInt(i)];
        });
        console.log(result);
    }
});
