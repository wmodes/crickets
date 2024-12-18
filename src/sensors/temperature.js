/**
 * temperature.js
 * 
 * Manages temperature sensor logic, including simulated temperature adjustments.
 */

const CONFIG = require('../../config');
const readline = require('readline');

class TemperatureSensor {
  constructor() {
    this.currentTemp = CONFIG.sensors.defaults.temperature;
    this.isDev = CONFIG.environment === 'dev'; // Check if in dev mode
    this.keyBuffer = [];
    console.log(`TemperatureSensor initialized with default temperature: ${this.currentTemp}°F`);
  }

  /**
   * Get the current temperature reading.
   * 
   * @returns {number} Current temperature.
   */
  getTemperature() {
    return this.currentTemp;
  }

  /**
   * Adjust the temperature interactively in dev mode.
   */
  devAdjust() {
    if (!this.isDev) return;

    while (this.keyBuffer.length > 0) {
      const key = this.keyBuffer.shift();
      if (key === 'up') {
        this.currentTemp += 2;
        console.log(`Temperature increased to ${this.currentTemp}°F`);
      } else if (key === 'down') {
        this.currentTemp -= 2;
        console.log(`Temperature decreased to ${this.currentTemp}°F`);
      }
    }
  }

  /**
   * Start a key listener to simulate temperature adjustments in dev mode.
   */
  startKeyListener() {
    if (!this.isDev) return;

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('Listening for temperature adjustments (up/down keys)...');

    process.stdin.setRawMode(true); // Allow processing individual keypresses
    process.stdin.resume();

    process.stdin.on('data', (chunk) => {
      const key = chunk.toString();
      if (key === '\u001b[A') { // Up arrow
        this.currentTemp += 2;
        console.log(`Temperature increased to ${this.currentTemp}°F`);
      } else if (key === '\u001b[B') { // Down arrow
        this.currentTemp -= 2;
        console.log(`Temperature decreased to ${this.currentTemp}°F`);
      } else if (key === '\u0003') { // Ctrl+C to exit
        console.log('Exiting key listener.');
        process.exit();
      }
    });
  }
  
}

module.exports = TemperatureSensor;
