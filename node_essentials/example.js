const yargs = require('yargs');

const argv = yargs
    .option('name', {
        alias: 'n',
        description: 'Your name',
        type: 'string',
    })
    .option('age', {
        alias: 'a',
        description: 'Your age',
        type: 'number',
    })
    .help()
    .alias('help', 'h')
    .argv;

    console.log(argv.name,argv.age,argv.address)