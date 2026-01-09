// logger.js
const { createLogger, format, transports } = require('winston');

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

// Wrapper to mimic npmlog: log(level, prefix, message)
function logWithPrefix(level, prefix, message) {
  baseLogger.log(level, `[${prefix}] ${message}`);
}

module.exports = {
  info: (prefix, message) => logWithPrefix('info', prefix, message),
  warn: (prefix, message) => logWithPrefix('warn', prefix, message),
  error: (prefix, message) => logWithPrefix('error', prefix, message),
  verbose: (prefix, message) => logWithPrefix('verbose', prefix, message),
  debug: (prefix, message) => logWithPrefix('debug', prefix, message),
  silly: (prefix, message) => logWithPrefix('silly', prefix, message)
};
