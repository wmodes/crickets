/**
 * @file logger.js
 * @description Configures Winston for logging. Outputs logs to the console for development and can be extended for file logging.
 * 
 * @exports logger - The configured Winston logger instance.
 */

const { createLogger, format, transports } = require('winston');

/**
 * Winston logger instance configured for the application.
 */
const logger = createLogger({
  level: 'debug', // Log level (debug, info, warn, error)
  format: format.combine(
    format.colorize(), // Colorize output for better readability
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamps
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [new transports.Console()], // Output logs to the console
});

module.exports = logger;
