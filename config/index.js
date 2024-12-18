/**
 * index.js
 *
 * Entry point for application configuration.
 * Dynamically loads and merges environment-specific configurations (dev or prod)
 * with the common configuration.
 *
 * Exports:
 * - CONFIG: The final merged configuration object.
 */

const path = require('path');
const deepmerge = require('deepmerge'); // Merges objects deeply
const COMMON_CONFIG = require('./common');

// Custom merge options to replace arrays instead of concatenating
const mergeOptions = {
  arrayMerge: (destinationArray, sourceArray, options) => sourceArray, // Replace arrays
};

// Dynamically determine the current environment
const currentSystem = process.platform; // 'darwin' (macOS), 'linux', or 'win32'
let ENV_CONFIG;
let ENV;

if (COMMON_CONFIG.system.prod === currentSystem) {
  ENV_CONFIG = require('./prod');
  ENV = 'prod';
} else {
  ENV_CONFIG = require('./dev');
  ENV = 'dev';
}

// Deep merge common and environment-specific configs with custom array behavior
const CONFIG = deepmerge(COMMON_CONFIG, ENV_CONFIG, mergeOptions);

// Add environment info to the final config
CONFIG.environment = ENV;

// console.log('Merged Configuration:', JSON.stringify(CONFIG, null, 2)); // Log the merged config

console.log(`Loaded ${ENV.toUpperCase()} configuration for system: ${currentSystem}`);

// Export the final configuration
module.exports = CONFIG;
