/**
 * Utility Module Index
 * Centralized exports for all utility modules
 */

// API Client utilities
export {
  createHttpClient,
  ApiError,
  isNetworkError,
  isTimeoutError,
  isApiError,
  createAuthInterceptor,
  createRetryInterceptor,
  createLoggingInterceptor
} from './api-client.js';

// Storage utilities
export {
  createStorage,
  StorageManager,
  detectPlatform as detectStoragePlatform
} from './storage.js';

// Audio utilities
export {
  createAudioPlayer,
  AudioManager,
  AudioProcessor,
  detectAudioPlatform
} from './audio.js';

// Platform detection utilities
export {
  detectPlatform,
  detectDevice,
  getPlatformCapabilities,
  getPlatformConfig,
  getFeatureFlags,
  initializePlatform,
  checkCompatibility
} from './platform-detector.js';

// Re-export default objects for convenience
import apiClient from './api-client.js';
import storage from './storage.js';
import audio from './audio.js';
import platform from './platform-detector.js';

export default {
  apiClient,
  storage,
  audio,
  platform
};