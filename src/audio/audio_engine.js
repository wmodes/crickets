/**
 * @file audio_engine.js
 * @description Handles low-level audio playback operations, including speed adjustments,
 * crossfades, and seamless looping using FFmpeg and Speaker.
 *
 * Responsibilities:
 * - Processes audio with FFmpeg to apply speed and fade effects.
 * - Manages playback looping and transitions.
 * - Provides a simple API for the controller to control playback.
 *
 * Exports:
 * - AudioEngine: Class for managing low-level audio playback.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Speaker = require('speaker');

class AudioEngine {
  constructor() {
    this.currentFile = null; // Path to the processed audio file
    this.lastSpeedFactor = null; // Last used speed factor
    this.isPlaying = false; // Playback state
  }

  /**
   * Process audio with speed and fade settings using FFmpeg.
   *
   * @param {string} inputFile - Path to the original audio file.
   * @param {number} speedFactor - Factor by which to adjust playback speed.
   * @param {number} fadeTime - Duration of fade-in and fade-out.
   * @param {number} playbackInterval - Total duration of the processed audio.
   * @returns {Promise<string>} Path to the processed audio file.
   */
  async processAudio(inputFile, speedFactor, fadeTime, playbackInterval) {
    if (speedFactor < 0.5) {
      console.warn(`Speed factor ${speedFactor} is too low. Clamping to 0.5.`);
      speedFactor = 0.5;
    }

    if (this.lastSpeedFactor === speedFactor && this.currentFile) {
      console.log(`Reusing processed audio file for speed factor ${speedFactor}`);
      return this.currentFile;
    }

    const outputFile = path.join('/tmp', `${uuidv4()}_adjusted.wav`);
    const fadeOutStart = playbackInterval - fadeTime;

    const ffmpegArgs = [
      '-y', '-i', inputFile,
      '-filter:a',
      `atempo=${speedFactor.toFixed(6)},afade=t=in:ss=0:d=${fadeTime},afade=t=out:st=${fadeOutStart}:d=${fadeTime}`,
      '-ar', '48000',
      '-c:a', 'pcm_f32le',
      outputFile,
    ];

    console.log(`Running FFmpeg to process audio: ${outputFile}`);

    await this.runFFmpeg(ffmpegArgs);

    if (fs.existsSync(outputFile)) {
      this.lastSpeedFactor = speedFactor;
      this.currentFile = outputFile;
      console.log(`Audio processed successfully: ${outputFile}`);
      return outputFile;
    } else {
      throw new Error(`FFmpeg failed to create processed audio file.`);
    }
  }

  /**
   * Run FFmpeg with the specified arguments.
   *
   * @param {string[]} args - FFmpeg arguments.
   * @returns {Promise<void>}
   */
  runFFmpeg(args) {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', args);

      ffmpeg.stderr.on('data', (data) => console.error(`FFmpeg STDERR: ${data.toString()}`));
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });
    });
  }

  /**
   * Start playback of the processed audio file.
   *
   * @param {string} file - Path to the audio file.
   */
  playAudio(file) {
    if (this.isPlaying) {
      console.warn('Audio is already playing.');
      return;
    }

    console.log(`Starting playback: ${file}`);
    const speaker = new Speaker({ sampleRate: 48000 });
    const stream = fs.createReadStream(file);

    stream.pipe(speaker);

    this.isPlaying = true;

    stream.on('end', () => {
      console.log('Audio playback ended.');
      this.isPlaying = false;
    });

    stream.on('error', (err) => {
      console.error(`Playback error: ${err}`);
      this.isPlaying = false;
    });
  }

  /**
   * Stop playback.
   */
  stopAudio() {
    if (!this.isPlaying) {
      console.warn('No audio is currently playing.');
      return;
    }

    console.log('Stopping playback.');
    this.isPlaying = false;
  }

  /**
   * Resample and play audio with updated settings.
   *
   * @param {string} inputFile - Path to the original audio file.
   * @param {number} speedFactor - Speed adjustment factor.
   * @param {number} playbackInterval - Playback duration.
   * @param {number} fadeTime - Fade duration.
   */
  async updateAndPlay(inputFile, speedFactor, playbackInterval, fadeTime) {
    const processedFile = await this.processAudio(inputFile, speedFactor, fadeTime, playbackInterval);
    this.playAudio(processedFile);
  }
}

module.exports = AudioEngine;
