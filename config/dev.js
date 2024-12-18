const DEV_CONFIG = {
  audio: {
      volume: 50, // Lower volume for development
  },
  paths: {
      data: "./data/dev",
  },
  debug: {
      enabled: true,
      logLevel: "DEBUG",
  },
  playback: {
      schedule: {
        crickets: { start: [7, 1], end: [12, 31] }, // Jul 1 - Dec 31
        inactive: { start: [1,1], end: [1, 14] }, // Jan 1 - Jan 14
      },
  },
};

module.exports = DEV_CONFIG;
