import { readdirSync, statSync, renameSync } from 'fs';
import { join } from 'path';

type BameConfig = {
    inReg: string,
    outReg: string,
    cwd?: string,
    options?: {
        renameDir?: boolean,
        verbose?: boolean
    }
};

const defaultConfig: BameConfig = Object.freeze({
    inReg: '(.*)',
    outReg: '{1}',
    cwd: process.cwd(),
    options: {
        renameDir: true,
        verbose: true
    }
});

const bame = (config: BameConfig = defaultConfig) => {
    config = Object.assign({}, defaultConfig, config);
    const logger = config.options!.verbose ? console.log : () => { };

    const files = readdirSync(config.cwd!);

    if (files) {
        files
            .filter(n => config.options!.renameDir ? true : !statSync(n).isDirectory())
            .sort()
            .forEach(file => {
                const matches = new RegExp(config.inReg).exec(file);

                if (matches) {
                    const newFile = config.outReg.replace(/{([0-9]+)}/g, (_, i: string) => {
                        return matches[parseInt(i)];
                    });

                    logger(`${file}     -->     ${newFile}`);
                    renameSync(join(config.cwd!, file), join(config.cwd!, newFile));
                }
            });
    } else {
        logger(`No file matching ${config.inReg} to rename`);
    }
}

export { bame, BameConfig };