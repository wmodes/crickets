/**
 * index.js
 * 
 * Entry point for sensor management. Combines temperature and light sensor logic.
 * Handles real GPIO in production and mocks GPIO in development.
 */

const ENV = process.env.NODE_ENV || 'development';
const TemperatureSensor = require('./temperature');
const LightSensor = require('./light');

// Use mock GPIO in development and real GPIO in production
const { Gpio } = ENV === 'production' ? require('onoff') : require('./mock-gpio');

class SensorManager {
  constructor() {
    this.temperatureSensor = new TemperatureSensor(Gpio);
    this.lightSensor = new LightSensor(Gpio);
  }

  /**
   * Read the current temperature from the temperature sensor.
   * 
   * @returns {number} Current temperature value.
   */
  readTemperature() {
    return this.temperatureSensor.getTemperature();
  }

  /**
   * Read the current light level from the light sensor.
   * 
   * @returns {number} Current light level.
   */
  readLight() {
    return this.lightSensor.getLightLevel();
  }

  /**
   * Provide a way to adjust simulated values interactively in dev mode.
   */
  devAdjust() {
    if (ENV === 'development') {
      this.temperatureSensor.devAdjust();
      this.lightSensor.devAdjust();
    }
  }

  /**
   * Start the key listener for dev mode interaction.
   */
  startKeyListener() {
    if (ENV === 'development') {
      this.temperatureSensor.startKeyListener();
    }
  }
}

module.exports = SensorManager;
