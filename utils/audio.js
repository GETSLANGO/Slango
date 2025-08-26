/**
 * Platform-agnostic audio utilities
 * Supports web (Web Audio API/HTML5 Audio), mobile (Expo Audio/React Native Sound), and Node.js
 */

/**
 * Audio Interface - Abstract base class
 */
class BaseAudioPlayer {
  constructor() {
    this.currentAudio = null;
    this.isPlaying = false;
    this.callbacks = {};
  }

  async play(audioData, callbacks = {}) {
    throw new Error('play method must be implemented');
  }

  async stop() {
    throw new Error('stop method must be implemented');
  }

  async pause() {
    throw new Error('pause method must be implemented');
  }

  async resume() {
    throw new Error('resume method must be implemented');
  }

  setVolume(volume) {
    throw new Error('setVolume method must be implemented');
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }

  emit(event, ...args) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(...args));
    }
  }
}

/**
 * Web Audio Player Implementation
 */
class WebAudioPlayer extends BaseAudioPlayer {
  constructor() {
    super();
    this.audioContext = null;
    this.gainNode = null;
    this.initializeAudioContext();
  }

  initializeAudioContext() {
    try {
      // Modern browsers
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
      }
    } catch (error) {
      console.warn('Web Audio API not available, falling back to HTML5 Audio');
    }
  }

  async play(audioData, callbacks = {}) {
    try {
      await this.stop(); // Stop any current playback

      // audioData can be a URL, Blob, or ArrayBuffer
      let audioUrl;
      
      if (typeof audioData === 'string') {
        audioUrl = audioData;
      } else if (audioData instanceof Blob) {
        audioUrl = URL.createObjectURL(audioData);
      } else if (audioData instanceof ArrayBuffer) {
        const blob = new Blob([audioData], { type: 'audio/mpeg' });
        audioUrl = URL.createObjectURL(blob);
      } else {
        throw new Error('Unsupported audio data type');
      }

      // Use Web Audio API if available, otherwise fallback to HTML5 Audio
      if (this.audioContext && this.audioContext.state !== 'suspended') {
        await this.playWithWebAudio(audioUrl, callbacks);
      } else {
        await this.playWithHTML5Audio(audioUrl, callbacks);
      }
    } catch (error) {
      this.emit('error', error);
      callbacks.onError && callbacks.onError(error);
      throw error;
    }
  }

  async playWithWebAudio(audioUrl, callbacks) {
    try {
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Fetch and decode audio data
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      // Create audio source
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.gainNode);

      // Set up event listeners
      source.onended = () => {
        this.isPlaying = false;
        this.currentAudio = null;
        this.emit('ended');
        callbacks.onEnd && callbacks.onEnd();
        
        // Clean up URL if it was created from Blob
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
      };

      // Start playback
      this.currentAudio = source;
      this.isPlaying = true;
      source.start();
      
      this.emit('play');
      callbacks.onPlay && callbacks.onPlay();
    } catch (error) {
      this.isPlaying = false;
      this.currentAudio = null;
      throw error;
    }
  }

  async playWithHTML5Audio(audioUrl, callbacks) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      
      audio.onplay = () => {
        this.isPlaying = true;
        this.emit('play');
        callbacks.onPlay && callbacks.onPlay();
        resolve();
      };

      audio.onended = () => {
        this.isPlaying = false;
        this.currentAudio = null;
        this.emit('ended');
        callbacks.onEnd && callbacks.onEnd();
        
        // Clean up URL if it was created from Blob
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
      };

      audio.onerror = (error) => {
        this.isPlaying = false;
        this.currentAudio = null;
        this.emit('error', error);
        callbacks.onError && callbacks.onError(error);
        reject(error);
      };

      this.currentAudio = audio;
      audio.play().catch(reject);
    });
  }

  async stop() {
    if (this.currentAudio) {
      if (this.currentAudio.stop) {
        // Web Audio API source
        this.currentAudio.stop();
      } else {
        // HTML5 Audio element
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      
      this.currentAudio = null;
      this.isPlaying = false;
      this.emit('stop');
    }
  }

  async pause() {
    if (this.currentAudio && this.currentAudio.pause) {
      this.currentAudio.pause();
      this.isPlaying = false;
      this.emit('pause');
    }
  }

  async resume() {
    if (this.currentAudio && this.currentAudio.play && !this.isPlaying) {
      await this.currentAudio.play();
      this.isPlaying = true;
      this.emit('resume');
    }
  }

  setVolume(volume) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    } else if (this.currentAudio && this.currentAudio.volume !== undefined) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

/**
 * React Native Audio Player Implementation
 */
class ReactNativeAudioPlayer extends BaseAudioPlayer {
  constructor(audioLibrary) {
    super();
    this.audioLibrary = audioLibrary; // Expo Audio or React Native Sound
    this.sound = null;
  }

  async play(audioData, callbacks = {}) {
    try {
      await this.stop(); // Stop any current playback

      // Implementation would depend on the specific audio library
      // This is a simplified example for Expo Audio
      if (this.audioLibrary.Audio) {
        const { sound } = await this.audioLibrary.Audio.Sound.createAsync(
          typeof audioData === 'string' ? { uri: audioData } : audioData,
          { shouldPlay: true }
        );

        this.sound = sound;
        this.isPlaying = true;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            this.isPlaying = false;
            this.currentAudio = null;
            this.emit('ended');
            callbacks.onEnd && callbacks.onEnd();
          }
        });

        this.emit('play');
        callbacks.onPlay && callbacks.onPlay();
      }
    } catch (error) {
      this.emit('error', error);
      callbacks.onError && callbacks.onError(error);
      throw error;
    }
  }

  async stop() {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
      this.isPlaying = false;
      this.emit('stop');
    }
  }

  async pause() {
    if (this.sound) {
      await this.sound.pauseAsync();
      this.isPlaying = false;
      this.emit('pause');
    }
  }

  async resume() {
    if (this.sound) {
      await this.sound.playAsync();
      this.isPlaying = true;
      this.emit('resume');
    }
  }

  setVolume(volume) {
    if (this.sound) {
      this.sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    }
  }
}

/**
 * Mock Audio Player for testing/SSR
 */
class MockAudioPlayer extends BaseAudioPlayer {
  async play(audioData, callbacks = {}) {
    this.isPlaying = true;
    this.emit('play');
    callbacks.onPlay && callbacks.onPlay();
    
    // Simulate audio playback duration
    setTimeout(() => {
      this.isPlaying = false;
      this.emit('ended');
      callbacks.onEnd && callbacks.onEnd();
    }, 1000);
  }

  async stop() {
    this.isPlaying = false;
    this.emit('stop');
  }

  async pause() {
    this.isPlaying = false;
    this.emit('pause');
  }

  async resume() {
    this.isPlaying = true;
    this.emit('resume');
  }

  setVolume(volume) {
    // Mock implementation
  }
}

/**
 * Audio Player Factory
 */
export function createAudioPlayer(platform = 'web', options = {}) {
  switch (platform) {
    case 'web':
      return new WebAudioPlayer();
    case 'react-native':
      if (!options.audioLibrary) {
        console.warn('Audio library not provided for React Native, using mock player');
        return new MockAudioPlayer();
      }
      return new ReactNativeAudioPlayer(options.audioLibrary);
    case 'mock':
    case 'test':
      return new MockAudioPlayer();
    default:
      if (typeof window !== 'undefined') {
        return new WebAudioPlayer();
      }
      return new MockAudioPlayer();
  }
}

/**
 * Audio Processing Utilities
 */
export class AudioProcessor {
  static async convertBlobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  static async convertResponseToBlob(response) {
    if (response.blob) {
      return await response.blob();
    }
    
    if (response.arrayBuffer) {
      const arrayBuffer = await response.arrayBuffer();
      return new Blob([arrayBuffer], { type: 'audio/mpeg' });
    }
    
    throw new Error('Unable to convert response to audio blob');
  }

  static createAudioUrl(audioData) {
    if (typeof audioData === 'string') {
      return audioData;
    }
    
    if (audioData instanceof Blob) {
      return URL.createObjectURL(audioData);
    }
    
    if (audioData instanceof ArrayBuffer) {
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      return URL.createObjectURL(blob);
    }
    
    throw new Error('Unsupported audio data type');
  }

  static revokeAudioUrl(url) {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
}

/**
 * Audio Manager - High-level interface for audio operations
 */
export class AudioManager {
  constructor(platform = 'web', options = {}) {
    this.player = createAudioPlayer(platform, options);
    this.volume = 1.0;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    // Platform-specific initialization
    this.isInitialized = true;
  }

  async playAudio(audioData, callbacks = {}) {
    await this.initialize();
    return this.player.play(audioData, callbacks);
  }

  async stopAudio() {
    return this.player.stop();
  }

  async pauseAudio() {
    return this.player.pause();
  }

  async resumeAudio() {
    return this.player.resume();
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.player.setVolume(this.volume);
  }

  getVolume() {
    return this.volume;
  }

  isPlaying() {
    return this.player.getIsPlaying();
  }

  on(event, callback) {
    this.player.on(event, callback);
  }

  off(event, callback) {
    this.player.off(event, callback);
  }
}

// Platform detection
export function detectAudioPlatform() {
  if (typeof window !== 'undefined' && window.Audio) {
    return 'web';
  }
  
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'react-native';
  }
  
  return 'mock';
}

// Default exports
export default {
  createAudioPlayer,
  AudioManager,
  AudioProcessor,
  detectAudioPlatform
};