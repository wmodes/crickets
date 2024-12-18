/**
 * @file playback_controller.js
 * @description Orchestrates high-level playback decisions, including determining active species,
 * adjusting playback speed, and interacting with the audio engine for playback execution.
 */

const logger = require('../utils/logger');
const AudioEngine = require('../audio/audio_engine');
const SensorManager = require('../sensors/index');
const CONFIG = require('../../config');

class PlaybackController {
  constructor() {
    this.audioEngine = new AudioEngine();
    this.sensorManager = new SensorManager();
    this.currentSpecies = null;
    this.lastSpeedFactor = null;

    this.lastCheckTime = 0; // Timestamp of the last sensor check
  }

  /**
   * Main loop logic for playback management.
   */
  run() {
    const now = Date.now();

    // Check sensors and update playback at the configured interval
    if (now - this.lastCheckTime >= CONFIG.playback.timing.check_interval * 1000) {
      logger.info('Running PlaybackController logic...');
      
      const temperature = this.sensorManager.readTemperature();
      const lightLevel = this.sensorManager.readLight();
      const species = this.getActiveSpecies();

      if (species === 'inactive') {
        logger.info('No active species for playback.');
        this.audioEngine.stopAudio();
        this.currentSpecies = null; // Reset state
      } else if (lightLevel > CONFIG.playback.light_threshold) {
        logger.info(`Light level ${lightLevel} exceeds threshold (${CONFIG.playback.light_threshold}). Stopping playback.`);
        this.stopPlayback();
      } else {
        const speedFactor = this.calculateSpeedFactor(temperature);
        this.updatePlayback(species, speedFactor, CONFIG.playback.timing.playback_interval, CONFIG.playback.timing.fade_time);
      }
      logger.info(`Species: "${species}", Temperature: ${temperature}, Light: ${lightLevel}`);

      this.lastCheckTime = now; // Update the last check timestamp
    }
  }

  /**
   * Updates playback settings and triggers audio playback if conditions change.
   * 
   * @param {string} species - The active species for playback (e.g., "frogs", "crickets").
   * @param {number} speedFactor - The factor by which playback speed is adjusted.
   * @param {number} playbackInterval - The total duration of the playback in seconds.
   * @param {number} fadeTime - The duration of fade-in and fade-out effects in seconds.
   */
  async updatePlayback(species, speedFactor, playbackInterval, fadeTime) {
    if (this.currentSpecies !== species || this.lastSpeedFactor !== speedFactor) {
      logger.info(`Updating playback for ${species} at speed factor ${speedFactor}`);

      const audioFile = `${CONFIG.paths.data}/audio/${species}_recording_1min.wav`;

      try {
        await this.audioEngine.updateAndPlay(audioFile, speedFactor, playbackInterval, fadeTime);
        this.currentSpecies = species;
        this.lastSpeedFactor = speedFactor;
      } catch (error) {
        logger.error(`Error updating playback: ${error.message}`);
      }
    } else {
      logger.info(`Playback for ${species} is already up-to-date.`);
    }
  }

  /**
   * Stops the current audio playback.
   */
  stopPlayback() {
    logger.info('Stopping playback.');
    this.audioEngine.stopAudio();
    this.currentSpecies = null;
    this.lastSpeedFactor = null;
  }

  /**
   * Determine the active species (frogs, crickets, or inactive) based on the playback schedule.
   * @returns {string} Active species ("frogs", "crickets", or "inactive").
   */
  getActiveSpecies() {
    const today = new Date();
    const { schedule } = CONFIG.playback;

    for (const [species, period] of Object.entries(schedule)) {
      const start = new Date(today.getFullYear(), period.start[0] - 1, period.start[1]);
      const end = new Date(today.getFullYear(), period.end[0] - 1, period.end[1]);

      if (start <= today && today <= end) {
        return species;
      }
    }

    return 'inactive';
  }

  /**
   * Calculate the playback speed adjustment factor based on temperature.
   * 
   * @param {number} temperature - The current temperature.
   * @returns {number} Speed adjustment factor.
   */
  calculateSpeedFactor(temperature) {
    const reference = CONFIG.playback.reference_temperature;
    const factor = (15 + (temperature - 50)) / (15 + (reference - 50));
    logger.info(`Calculated speed factor: ${factor}`);
    return factor;
  }
}

module.exports = PlaybackController;
