// src/sensors/mock-gpio.js
module.exports = {
  Gpio: class {
      constructor(pin, direction) {
          console.log(`Mock GPIO pin ${pin} initialized in ${direction} mode.`);
      }
      writeSync(value) {
          console.log(`Mock GPIO pin writeSync: ${value}`);
      }
      readSync() {
          console.log(`Mock GPIO pin readSync.`);
          return 0; // Simulating a "low" signal
      }
      unexport() {
          console.log(`Mock GPIO pin unexported.`);
      }
  }
};
