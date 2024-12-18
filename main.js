/**
 * main.js
 *
 * Entry point for the playback system. Initializes the PlaybackController
 * to manage cricket and frog audio based on environmental conditions.
 */

const PlaybackController = require('./src/controllers/playback_controller');
const CONFIG = require('./config');
const logger = require('./src/utils/logger');

logger.info('Starting playback system...');
const controller = new PlaybackController();

// Determine interval in milliseconds
const checkIntervalMs = CONFIG.playback.timing.check_interval * 1000;

try {
  setInterval(() => {
    logger.info('Calling controller.run...');
    controller.run(); // Only log when running playback logic
  }, checkIntervalMs); // Use the defined check_interval
} catch (error) {
  logger.error(`Playback system stopped due to an error: ${error.message}`);
}
