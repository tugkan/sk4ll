// Logger service
const winston = require('winston');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { argv } = yargs(hideBin(process.argv));

const alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        all: true,
    }),
    winston.format.printf(
        (info) => info.message,
    ),
);

const Logger = winston.createLogger({
    level: argv.logLevel || 'info',
    transports: [
        new (winston.transports.Console)({
            format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
        }),
    ],
});

module.exports = Logger;
