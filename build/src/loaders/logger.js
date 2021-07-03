"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.silly = exports.debug = exports.verbose = exports.http = exports.info = exports.warn = exports.error = exports.fatal = exports.errorStream = exports.infoStream = void 0;
const { addColors, createLogger, log, format, transports } = require('winston');
const fluentLogger = require('fluent-logger');
const fluentTag = 'service.itdda.backend';
const fluentConfig = {
    host: 'fluentd',
    port: 24224,
    timeout: 3.0,
    requireAckResponse: false
};
const loggerLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        verbose: 5,
        debug: 6,
        silly: 7
    },
    colors: {
        fatal: 'magenta'
    }
};
addColors(loggerLevels.colors);
const colorize = format.colorize();
let logger;
const consoleLoggerFormat = format.printf(({ level, message, timestamp, stack, reqId }) => {
    let logMessage = '';
    if (reqId)
        logMessage += `${reqId} - `;
    logMessage += `${stack || message}`;
    return `${colorize.colorize(level, `[${timestamp}][${level.toUpperCase()}]`)} - ${logMessage}`;
});
if (process.env.NODE_ENV === 'production') {
    const loggerFormat = format.printf((info) => {
        const { level, message, stack } = info;
        return JSON.stringify({
            log: Object.assign(Object.assign({}, info), { message: `[${level.toUpperCase()}] - ${stack || message}` })
        });
    });
    const FluentTransport = fluentLogger.support.winstonTransport({
        level: 'info',
        format: format.combine(format.timestamp(), format.errors({ stack: true }), format.splat(), loggerFormat)
    });
    logger = createLogger({
        levels: loggerLevels.levels,
        transports: [
            new FluentTransport(fluentTag, fluentConfig),
            new transports.Console({
                level: 'info',
                format: format.combine(format.timestamp(), format.errors({ stack: true }), consoleLoggerFormat),
                handleExceptions: true
            })
        ]
    });
}
else {
    logger = createLogger({
        levels: loggerLevels.levels,
        format: format.combine(format.timestamp(), format.errors({ stack: true }), consoleLoggerFormat),
        transports: [
            new transports.Console({
                level: 'debug',
                handleExceptions: true
            })
        ]
    });
}
function parseHttpLog(text) {
    try {
        const data = JSON.parse(text);
        const message = `"${data.method} ${data.url}" ${data.status} ${data.responseTime} ms${data.body ? ` - ${JSON.stringify(data.body)}` : ''}`;
        delete data.body;
        return { message, data };
    }
    catch (e) {
        return { message: text };
    }
}
const infoStream = {
    write: (text) => {
        const { message, data } = parseHttpLog(text);
        logger.info(message, data);
    }
};
exports.infoStream = infoStream;
const errorStream = {
    write: (text) => {
        const { message, data } = parseHttpLog(text);
        if (data.status === '500')
            logger.fatal(message, data);
        else
            logger.error(message, data);
    }
};
exports.errorStream = errorStream;
const fatal = (...args) => logger.fatal.apply(null, args);
exports.fatal = fatal;
const error = (...args) => logger.error.apply(null, args);
exports.error = error;
const warn = (...args) => logger.warn.apply(null, args);
exports.warn = warn;
const info = (...args) => logger.info.apply(null, args);
exports.info = info;
const http = (...args) => logger.http.apply(null, args); // !Caution! http는 fluent에서 지원하지 않음
exports.http = http;
const verbose = (...args) => logger.verbose.apply(null, args);
exports.verbose = verbose;
const debug = (...args) => logger.debug.apply(null, args);
exports.debug = debug;
const silly = (...args) => logger.silly.apply(null, args);
exports.silly = silly;
