/**
 * light.js
 * 
 * Manages light sensor logic, including simulated light level adjustments.
 */

const CONFIG = require('../../config');

class LightSensor {
  constructor() {
    this.currentLight = CONFIG.sensors.defaults.light;
    this.isDev = CONFIG.environment === 'dev'; // Check if in dev mode
    console.log(`LightSensor initialized with default light level: ${this.currentLight}`);
  }

  /**
   * Get the current light level.
   * 
   * @returns {number} Current light level.
   */
  getLightLevel() {
    return this.currentLight;
  }

  /**
   * Adjust the light level interactively in dev mode.
   */
  devAdjust() {
    if (!this.isDev) return;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Adjust light level (left/right): ', (direction) => {
      if (direction === 'left') {
        this.currentLight -= 2;
        console.log(`Light decreased to ${this.currentLight}`);
      } else if (direction === 'right') {
        this.currentLight += 2;
        console.log(`Light increased to ${this.currentLight}`);
      }
      rl.close();
    });
  }
}

module.exports = LightSensor;
