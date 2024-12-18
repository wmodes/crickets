/**
 * common.js
 *
 * Shared configuration for the playback system. Provides common settings
 * applicable to all environments (dev, prod).
 *
 * Dependencies:
 * - dotenv for loading environment variables.
 *
 * Exports:
 * - CONFIG: The main configuration object.
 */

const path = require('path');
const os = require('os');
require('dotenv').config();

const CONFIG = {
  system: {
    dev: 'Darwin', // macOS system name
    prod: 'Linux', // Raspberry Pi typically runs Linux
  },
  sensors: {
    temperature: 'DHT11',
    light: 'BH1750',
    defaults: {
      temperature: 64,
      light: 50,
    },
  },
  audio: {
    volume: parseInt(process.env.AUDIO_VOLUME || '75', 10), // Default to 75% volume
    default_files: {
      frogs: 'data/audio/frog_recording_1min.wav',
      crickets: 'data/audio/cricket_recording_1min.wav',
    },
  },
  playback: {
    schedule: {
      frogs: { start: [1, 15], end: [6, 30] }, // Jan 15 - Jun 30
      crickets: { start: [7, 1], end: [11, 14] }, // Jul 1 - Nov 14
      inactive: { start: [11, 15], end: [1, 14] }, // Nov 15 - Jan 14
    },
    reference_temperature: 64,
    timing: {
      check_interval: 10, // Interval in seconds for sensor checks
      playback_interval: (1 * 60) - 5, // Interval in seconds for playback adjustments
      fade_time: 5, // Crossfade duration in seconds
      prep_time: 5, // Preparation time before playback in seconds
    },
    light_threshold: 20, // Maximum light level for playback
  },
  paths: {
    base: __dirname,
    data: path.join(__dirname, '..', 'data'),
    temp: os.tmpdir(), // Temporary file directory
  },
};

module.exports = CONFIG;
