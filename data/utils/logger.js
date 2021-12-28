import winston from 'winston';

export const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename: 'hhsb.log'})
    ]
});

