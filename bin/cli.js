#!/usr/bin/env node

const {bame} = require('..');

var argv = require('yargs')
    .usage('Usage: bame <inReg> <outReg>')
    .option('d', {alias: 'no-dir', boolean:true, description:'Should not rename directories'})
    .option('q', {alias: 'quiet', boolean:true, description:'Rename silently'})
    .demandCommand(2)
    .alias('h', 'help')
    .alias('v', 'version')
    .example('bame "(.*) Episode(.*)" "{1}.E{2}"')
    .argv;
    
bame({
    inReg: argv._[0],
    outReg: argv._[1],
    options:{
        renameDir: !argv.d,
        verbose: !argv.q
    }
})
