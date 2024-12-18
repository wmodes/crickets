const PROD_CONFIG = {
  audio: {
      volume: 100, // Full volume for production
  },
  paths: {
      data: "./data/prod",
  },
  debug: {
      enabled: false,
      logLevel: "WARNING",
  },
};

module.exports = PROD_CONFIG;
