// Logger service
import winston from 'winston';

const alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        all: true,
    }),
    winston.format.printf(
        (info) => info.message,
    ),
);

const Logger = winston.createLogger({
    level: process.env.DEBUG_LEVEL || 'info',
    transports: [
        new (winston.transports.Console)({
            format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
        }),
    ],
});

module.exports = Logger;
