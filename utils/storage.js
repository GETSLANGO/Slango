/**
 * Platform-agnostic storage utilities
 * Supports web (localStorage/sessionStorage), mobile (AsyncStorage), and in-memory fallback
 */

/**
 * Storage Interface - Abstract base class
 */
class BaseStorage {
  async get(key) {
    throw new Error('get method must be implemented');
  }

  async set(key, value) {
    throw new Error('set method must be implemented');
  }

  async remove(key) {
    throw new Error('remove method must be implemented');
  }

  async clear() {
    throw new Error('clear method must be implemented');
  }

  async keys() {
    throw new Error('keys method must be implemented');
  }
}

/**
 * Web Storage Implementation (localStorage/sessionStorage)
 */
class WebStorage extends BaseStorage {
  constructor(storageType = 'localStorage') {
    super();
    this.storage = typeof window !== 'undefined' 
      ? window[storageType] 
      : null;
    
    if (!this.storage) {
      console.warn(`${storageType} not available, falling back to memory storage`);
      this.storage = new Map();
      this.isMemoryFallback = true;
    }
  }

  async get(key) {
    try {
      if (this.isMemoryFallback) {
        return this.storage.get(key) || null;
      }
      
      const value = this.storage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  async set(key, value) {
    try {
      if (this.isMemoryFallback) {
        this.storage.set(key, value);
        return;
      }
      
      this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
      throw new Error('Failed to save to storage');
    }
  }

  async remove(key) {
    try {
      if (this.isMemoryFallback) {
        this.storage.delete(key);
        return;
      }
      
      this.storage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }

  async clear() {
    try {
      if (this.isMemoryFallback) {
        this.storage.clear();
        return;
      }
      
      this.storage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  async keys() {
    try {
      if (this.isMemoryFallback) {
        return Array.from(this.storage.keys());
      }
      
      return Object.keys(this.storage);
    } catch (error) {
      console.error('Storage keys error:', error);
      return [];
    }
  }
}

/**
 * React Native Storage Implementation (AsyncStorage)
 */
class ReactNativeStorage extends BaseStorage {
  constructor(AsyncStorage) {
    super();
    this.AsyncStorage = AsyncStorage;
  }

  async get(key) {
    try {
      const value = await this.AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('AsyncStorage get error:', error);
      return null;
    }
  }

  async set(key, value) {
    try {
      await this.AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('AsyncStorage set error:', error);
      throw new Error('Failed to save to storage');
    }
  }

  async remove(key) {
    try {
      await this.AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage remove error:', error);
    }
  }

  async clear() {
    try {
      await this.AsyncStorage.clear();
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
    }
  }

  async keys() {
    try {
      return await this.AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('AsyncStorage keys error:', error);
      return [];
    }
  }
}

/**
 * In-Memory Storage Implementation (fallback)
 */
class MemoryStorage extends BaseStorage {
  constructor() {
    super();
    this.storage = new Map();
  }

  async get(key) {
    return this.storage.get(key) || null;
  }

  async set(key, value) {
    this.storage.set(key, value);
  }

  async remove(key) {
    this.storage.delete(key);
  }

  async clear() {
    this.storage.clear();
  }

  async keys() {
    return Array.from(this.storage.keys());
  }
}

/**
 * Storage Factory - Creates appropriate storage for platform
 */
export function createStorage(platform = 'web', options = {}) {
  switch (platform) {
    case 'web':
      return new WebStorage(options.storageType);
    case 'react-native':
      if (!options.AsyncStorage) {
        throw new Error('AsyncStorage must be provided for React Native');
      }
      return new ReactNativeStorage(options.AsyncStorage);
    case 'memory':
      return new MemoryStorage();
    default:
      return new WebStorage();
  }
}

/**
 * Storage Manager - High-level interface for app data
 */
export class StorageManager {
  constructor(storage, keyPrefix = 'slangswap_') {
    this.storage = storage;
    this.keyPrefix = keyPrefix;
  }

  _getKey(key) {
    return `${this.keyPrefix}${key}`;
  }

  async getTranslationHistory() {
    return await this.storage.get(this._getKey('translation_history')) || [];
  }

  async saveTranslation(translation) {
    const history = await this.getTranslationHistory();
    const newHistory = [translation, ...history].slice(0, 100); // Keep last 100
    await this.storage.set(this._getKey('translation_history'), newHistory);
  }

  async clearTranslationHistory() {
    await this.storage.remove(this._getKey('translation_history'));
  }

  async getLanguagePreferences() {
    return await this.storage.get(this._getKey('language_preferences')) || {
      sourceLanguage: 'standard_english',
      targetLanguage: 'gen_z_english'
    };
  }

  async saveLanguagePreferences(preferences) {
    await this.storage.set(this._getKey('language_preferences'), preferences);
  }

  async getUserSettings() {
    return await this.storage.get(this._getKey('user_settings')) || {
      theme: 'dark',
      autoPlayVoice: false,
      voiceSpeed: 1.0,
      notifications: true
    };
  }

  async saveUserSettings(settings) {
    const currentSettings = await this.getUserSettings();
    const newSettings = { ...currentSettings, ...settings };
    await this.storage.set(this._getKey('user_settings'), newSettings);
  }

  async getCache(key) {
    const cache = await this.storage.get(this._getKey('cache')) || {};
    const item = cache[key];
    
    if (!item) return null;
    
    // Check if cache item has expired
    if (item.expires && Date.now() > item.expires) {
      await this.removeFromCache(key);
      return null;
    }
    
    return item.data;
  }

  async setCache(key, data, ttlMs = 300000) { // 5 minutes default
    const cache = await this.storage.get(this._getKey('cache')) || {};
    cache[key] = {
      data,
      expires: Date.now() + ttlMs,
      created: Date.now()
    };
    await this.storage.set(this._getKey('cache'), cache);
  }

  async removeFromCache(key) {
    const cache = await this.storage.get(this._getKey('cache')) || {};
    delete cache[key];
    await this.storage.set(this._getKey('cache'), cache);
  }

  async clearCache() {
    await this.storage.remove(this._getKey('cache'));
  }

  async clearAllData() {
    const keys = await this.storage.keys();
    const appKeys = keys.filter(key => key.startsWith(this.keyPrefix));
    
    for (const key of appKeys) {
      await this.storage.remove(key);
    }
  }
}

// Platform detection utility
export function detectPlatform() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return 'web';
  }
  
  // React Native detection
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'react-native';
  }
  
  // Node.js detection
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return 'node';
  }
  
  return 'unknown';
}

// Default exports for easy importing
export default {
  createStorage,
  StorageManager,
  detectPlatform
};