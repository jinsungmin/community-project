const {addColors, createLogger, log, format, transports} = require('winston')
const fluentLogger = require('fluent-logger')

const fluentTag = 'service.itdda.backend'
const fluentConfig = {
  host: 'fluentd',
  port: 24224,
  timeout: 3.0,
  requireAckResponse: false
}
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
}
addColors(loggerLevels.colors)
const colorize = format.colorize()
let logger

const consoleLoggerFormat = format.printf(({level, message, timestamp, stack, reqId}) => {
  let logMessage = ''
  if (reqId) logMessage += `${reqId} - `
  logMessage += `${stack || message}`
  return `${colorize.colorize(level, `[${timestamp}][${level.toUpperCase()}]`)} - ${logMessage}`
})

if (process.env.NODE_ENV === 'production') {
  const loggerFormat = format.printf((info) => {
    const {level, message, stack} = info
    return JSON.stringify({
      log: {...info, message: `[${level.toUpperCase()}] - ${stack || message}`}
    })
  })
  const FluentTransport = fluentLogger.support.winstonTransport({
    level: 'info',
    format: format.combine(format.timestamp(), format.errors({stack: true}), format.splat(), loggerFormat)
  })
  logger = createLogger({
    levels: loggerLevels.levels,
    transports: [
      new FluentTransport(fluentTag, fluentConfig),
      new transports.Console({
        level: 'info',
        format: format.combine(format.timestamp(), format.errors({stack: true}), consoleLoggerFormat),
        handleExceptions: true
      })
    ]
  })
} else {
  logger = createLogger({
    levels: loggerLevels.levels,
    format: format.combine(format.timestamp(), format.errors({stack: true}), consoleLoggerFormat),
    transports: [
      new transports.Console({
        level: 'debug',
        handleExceptions: true
      })
    ]
  })
}

function parseHttpLog(text: string) {
  try {
    const data = JSON.parse(text)
    const message = `"${data.method} ${data.url}" ${data.status} ${data.responseTime} ms${
      data.body ? ` - ${JSON.stringify(data.body)}` : ''
    }`
    delete data.body
    return {message, data}
  } catch (e) {
    return {message: text}
  }
}

const infoStream = {
  write: (text: string): void => {
    const {message, data} = parseHttpLog(text)
    logger.info(message, data)
  }
}
const errorStream = {
  write: (text: string): void => {
    const {message, data} = parseHttpLog(text)
    if (data.status === '500') logger.fatal(message, data)
    else logger.error(message, data)
  }
}

const fatal = (...args: any[]): void => logger.fatal.apply(null, args)
const error = (...args: any[]): void => logger.error.apply(null, args)
const warn = (...args: any[]): void => logger.warn.apply(null, args)
const info = (...args: any[]): void => logger.info.apply(null, args)
const http = (...args: any[]): void => logger.http.apply(null, args) // !Caution! http는 fluent에서 지원하지 않음
const verbose = (...args: any[]): void => logger.verbose.apply(null, args)
const debug = (...args: any[]): void => logger.debug.apply(null, args)
const silly = (...args: any[]): void => logger.silly.apply(null, args)

export {infoStream, errorStream, fatal, error, warn, info, http, verbose, debug, silly}
