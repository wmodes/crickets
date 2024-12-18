# Crickets and Frogs Playback System

## Description

The **Crickets and Frogs Playback System** simulates cricket and frog sounds based on environmental conditions such as temperature and light. The playback adjusts speed dynamically to reflect the temperature, while stopping playback when the environment is too bright.

This project is designed to run on a Raspberry Pi or a development machine, with modular components for audio playback, sensors, and logging.

## Features

- **Dynamic Playback**: Adjusts playback speed based on temperature.
- **Light Sensitivity**: Stops playback if the light level is above a configurable threshold.
- **Seasonal Scheduling**: Plays cricket or frog sounds based on predefined active periods.
- **Crossfade and Looping**: Ensures smooth transitions between playback loops.
- **Configurable and Extendable**: Uses environment-specific configurations for dev and prod.

## Requirements

- Node.js (v18 or later recommended)
- FFmpeg (must be installed and available in `PATH`)
- NPM or Yarn

### Dependencies

Install project dependencies with:

```
npm install
```

## Directory Structure
    .
    ├── config/                 # Configuration files for dev, prod, and common settings
    ├── data/                   # Data directory for recordings and other runtime data
    ├── src/                    # Core application logic
    │   ├── audio/              # Audio engine and playback components
    │   ├── controllers/        # High-level playback orchestration
    │   ├── sensors/            # Sensor handling logic
    │   ├── utils/              # Utility functions like logging and scheduling
    ├── experiments/            # Non-production experiments and tests
    ├── node_modules/           # Installed dependencies
    ├── README.md               # Project documentation
    ├── package.json            # Project metadata and dependencies
    ├── main.js                 # Entry point for the application
    └── .gitignore              # Files and directories to ignore in version control

## Setup

### Environment Configuration

1. Create a `.env` file in the root directory:
2. Modify configurations in the `config/` directory as needed.

### Running the Application

To start the playback system:

```
node main.js
```

## Development

### Experiments

Temporary experimental scripts can be placed in the `experiments/` directory. These files are ignored by version control.


### Debugging

Logs are written to the console using the `winston` logging library. Adjust logging levels in the config files.

## License

MIT License
