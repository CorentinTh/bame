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

type DeepRequired<T> = {
    [P in keyof Required<T>]: T[P] extends object ? DeepRequired<T[P]> : NonNullable<Required<T[P]>>
}

// Default config, each params will be overwritten by user's config
const defaultConfig: DeepRequired<BameConfig> = Object.freeze({
    cwd: process.cwd(),
    inReg: '(.*)',
    options: {
        renameDir: true,
        verbose: true
    },
    outReg: '{1}'
});

/**
 * Rename files using Regexs
 * @param config {BameConfig} Bame configuration parameters
 */
const bame = (config: BameConfig = defaultConfig) => {
    const parsedConfig: DeepRequired<BameConfig> = Object.assign({}, defaultConfig, config);
    
    const logger = parsedConfig.options.verbose ? console.log : () => { };
    
    const files = readdirSync(parsedConfig.cwd);
    
    if (files) {
        files
        .filter(n => parsedConfig.options.renameDir ? true : !statSync(n).isDirectory())
        .sort()
        .forEach(file => {
            const matches = new RegExp(parsedConfig.inReg).exec(file);
            
            if (matches) {
                const newFile = parsedConfig.outReg.replace(/{([0-9]+)}/g, (_, i: string) => {
                    return matches[parseInt(i)];
                });
                
                logger(`${file}     -->     ${newFile}`);
                renameSync(join(parsedConfig.cwd, file), join(parsedConfig.cwd, newFile));
            }
        });
    } else {
        logger(`No file matching ${parsedConfig.inReg} to rename`);
    }
}

export { bame, BameConfig };
