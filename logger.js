// logger.js
const { createLogger, format, transports } = require('winston');
const util = require('util');

const baseLogger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level} ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' })
  ]
});

// Mimic npmlog: logger.info(prefix, msg, ...args)
function logWithPrefix(level, prefix, msg, ...args) {
  const formattedMessage = util.format(msg, ...args);
  baseLogger.log(level, `[${prefix}] ${formattedMessage}`);
}

module.exports = {
  info: (prefix, msg, ...args) => logWithPrefix('info', prefix, msg, ...args),
  warn: (prefix, msg, ...args) => logWithPrefix('warn', prefix, msg, ...args),
  error: (prefix, msg, ...args) => logWithPrefix('error', prefix, msg, ...args),
  verbose: (prefix, msg, ...args) => logWithPrefix('verbose', prefix, msg, ...args),
  debug: (prefix, msg, ...args) => logWithPrefix('debug', prefix, msg, ...args),
  silly: (prefix, msg, ...args) => logWithPrefix('silly', prefix, msg, ...args)
};
