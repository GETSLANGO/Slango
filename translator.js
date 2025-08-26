/**
 * Core Translation Engine - Platform Agnostic
 * Handles all translation logic, API calls, and data processing
 * Can be used in web, mobile, or any JavaScript environment
 */

// Language configuration with voice profiles
export const LANGUAGE_CONFIGS = {
  // DELETED: Standard English config removed as requested
  gen_z_english: {
    code: 'gen_z_english',
    name: 'Gen Z Slang',
    flag: '🔥',
    voiceId: '3XOBzXhnDY98yeWQ3GdM', // Youthful voice
    voiceSettings: {
      stability: 0.6,
      similarity_boost: 0.9,
      style: 0.4,
      use_speaker_boost: true
    }
  },
  british_english: {
    code: 'british_english',
    name: 'British English',
    flag: '🇬🇧',
    voiceId: 'yoZ06aMxZJJ28mfd3POQ', // British accent
    voiceSettings: {
      stability: 0.8,
      similarity_boost: 0.7,
      style: 0.1,
      use_speaker_boost: true
    }
  },

  spanish: {
    code: 'spanish',
    name: 'Spanish',
    flag: '🇪🇸',
    voiceId: 'onwK4e9ZLuTAKqWW03F9', // Spanish voice
    voiceSettings: {
      stability: 0.8,
      similarity_boost: 0.8,
      style: 0.1,
      use_speaker_boost: true
    }
  },
  french: {
    code: 'french',
    name: 'French',
    flag: '🇫🇷',
    voiceId: 'ThT5KcBeYPX3keUQqHPh', // French voice
    voiceSettings: {
      stability: 0.8,
      similarity_boost: 0.8,
      style: 0.1,
      use_speaker_boost: true
    }
  },
  formal_english: {
    code: 'formal_english',
    name: 'Formal English',
    flag: '🇺🇸',
    voiceId: '1t1EeRixsJrKbiF1zwM6', // Professional voice (same as standard)
    voiceSettings: {
      stability: 0.85,
      similarity_boost: 0.75,
      style: 0.1,
      use_speaker_boost: true
    }
  }
};

/**
 * Core Translation Engine Class
 */
export class TranslationEngine {
  constructor(config = {}) {
    this.apiBaseUrl = config.apiBaseUrl || '/api';
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
    
    // Platform-agnostic HTTP client (can be injected)
    this.httpClient = config.httpClient || this._defaultHttpClient;
  }

  /**
   * Default HTTP client for web environments
   * Can be replaced with platform-specific implementations
   */
  async _defaultHttpClient(url, options = {}) {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Retry mechanism for API calls
   */
  async _withRetry(operation, retries = this.maxRetries) {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this._withRetry(operation, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Validate translation request
   */
  _validateTranslationRequest(inputText, sourceLanguage, targetLanguage) {
    if (!inputText || typeof inputText !== 'string') {
      throw new Error('Input text is required and must be a string');
    }

    if (inputText.length > 5000) {
      throw new Error('Input text must be 5000 characters or less');
    }

    if (!LANGUAGE_CONFIGS[sourceLanguage]) {
      throw new Error(`Unsupported source language: ${sourceLanguage}`);
    }

    if (!LANGUAGE_CONFIGS[targetLanguage]) {
      throw new Error(`Unsupported target language: ${targetLanguage}`);
    }

    if (sourceLanguage === targetLanguage) {
      throw new Error('Source and target languages must be different');
    }
  }

  /**
   * Main translation method using Bridge Layer Architecture
   */
  // DELETED: Bridge architecture translation method removed as requested

  /**
   * Run QA smoke tests
   */
  async runSmokeTests() {
    return this._withRetry(async () => {
      const response = await this.httpClient(`${this.apiBaseUrl}/qa/smoke-tests`);
      return response;
    });
  }

  /**
   * Run full QA test suite
   */
  async runFullTests() {
    return this._withRetry(async () => {
      const response = await this.httpClient(`${this.apiBaseUrl}/qa/full-tests`);
      return response;
    });
  }

  // DELETED: Cache stats function removed as requested

  // DELETED: Clear all caches function removed as requested

  /**
   * Get translation history
   */
  async getTranslationHistory(limit = 10) {
    return this._withRetry(async () => {
      return this.httpClient(`${this.apiBaseUrl}/translations/recent?limit=${limit}`);
    });
  }

  /**
   * Get language configuration
   */
  getLanguageConfig(languageCode) {
    return LANGUAGE_CONFIGS[languageCode] || null;
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages() {
    return Object.values(LANGUAGE_CONFIGS);
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(languageCode) {
    return languageCode in LANGUAGE_CONFIGS;
  }
}

/**
 * Voice Engine Class - Platform Agnostic
 */
export class VoiceEngine {
  constructor(config = {}) {
    this.apiBaseUrl = config.apiBaseUrl || '/api';
    this.httpClient = config.httpClient || this._defaultHttpClient;
    this.audioContext = null;
    this.currentAudio = null;
  }

  async _defaultHttpClient(url, options = {}) {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  }

  /**
   * Generate speech for text with language-specific voice
   */
  async generateSpeech(text, languageCode, options = {}) {
    const languageConfig = LANGUAGE_CONFIGS[languageCode];
    if (!languageConfig) {
      throw new Error(`Unsupported language for voice generation: ${languageCode}`);
    }

    const response = await this.httpClient(`${this.apiBaseUrl}/voice/generate`, {
      method: 'POST',
      body: JSON.stringify({
        text: text.trim(),
        targetLanguage: languageCode,
        voiceSettings: {
          ...languageConfig.voiceSettings,
          ...options.voiceSettings
        }
      })
    });

    return response;
  }

  /**
   * Play audio (web-specific implementation)
   */
  async playAudio(audioResponse, onPlay = null, onEnd = null, onError = null) {
    try {
      // Stop any currently playing audio
      this.stopAudio();

      // Create audio from response
      const audioBlob = await audioResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Platform-specific audio playback
      if (typeof Audio !== 'undefined') {
        // Web environment
        this.currentAudio = new Audio(audioUrl);
        
        this.currentAudio.onplay = () => onPlay && onPlay();
        this.currentAudio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          onEnd && onEnd();
        };
        this.currentAudio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          onError && onError(error);
        };
        
        await this.currentAudio.play();
      } else {
        // Mobile/React Native environment would use different audio implementation
        throw new Error('Audio playback not supported in this environment');
      }
    } catch (error) {
      onError && onError(error);
      throw error;
    }
  }

  /**
   * Stop current audio playback
   */
  stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  /**
   * Check if audio is currently playing
   */
  isPlaying() {
    return this.currentAudio && !this.currentAudio.paused;
  }

  /**
   * Get voice configuration for language
   */
  getVoiceConfig(languageCode) {
    const config = LANGUAGE_CONFIGS[languageCode];
    return config ? {
      voiceId: config.voiceId,
      voiceSettings: config.voiceSettings
    } : null;
  }
}

/**
 * Translation State Manager - Platform Agnostic
 */
export class TranslationStateManager {
  constructor() {
    this.state = {
      sourceLanguage: 'standard_english',
      targetLanguage: 'gen_z_english',
      inputText: '',
      outputText: '',
      explanation: '',
      isTranslating: false,
      isGeneratingVoice: false,
      translationHistory: [],
      error: null
    };
    
    this.listeners = [];
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Update state and notify listeners
   */
  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    this.listeners.forEach(listener => {
      listener(this.state, prevState);
    });
  }

  /**
   * Get current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Reset state to defaults
   */
  reset() {
    this.setState({
      inputText: '',
      outputText: '',
      explanation: '',
      isTranslating: false,
      isGeneratingVoice: false,
      error: null
    });
  }

  /**
   * Swap source and target languages
   */
  swapLanguages() {
    this.setState({
      sourceLanguage: this.state.targetLanguage,
      targetLanguage: this.state.sourceLanguage,
      inputText: this.state.outputText,
      outputText: this.state.inputText
    });
  }
}

/**
 * Complete Translation Service - Orchestrates all components
 */
export class TranslationService {
  constructor(config = {}) {
    this.translationEngine = new TranslationEngine(config);
    this.voiceEngine = new VoiceEngine(config);
    this.stateManager = new TranslationStateManager();
  }

  /**
   * Perform translation with state management
   */
  async translate(inputText, sourceLanguage, targetLanguage) {
    this.stateManager.setState({ 
      isTranslating: true, 
      error: null,
      inputText,
      sourceLanguage,
      targetLanguage
    });

    try {
      const result = await this.translationEngine.translate(
        inputText, 
        sourceLanguage, 
        targetLanguage
      );

      this.stateManager.setState({
        outputText: result.outputText,
        explanation: result.explanation,
        isTranslating: false
      });

      return result;
    } catch (error) {
      this.stateManager.setState({
        isTranslating: false,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Generate and play voice with state management
   */
  async playVoice(text, languageCode, callbacks = {}) {
    this.stateManager.setState({ 
      isGeneratingVoice: true, 
      error: null 
    });

    try {
      const audioResponse = await this.voiceEngine.generateSpeech(text, languageCode);
      
      await this.voiceEngine.playAudio(
        audioResponse,
        () => {
          this.stateManager.setState({ isGeneratingVoice: false });
          callbacks.onPlay && callbacks.onPlay();
        },
        () => {
          callbacks.onEnd && callbacks.onEnd();
        },
        (error) => {
          this.stateManager.setState({ 
            isGeneratingVoice: false, 
            error: error.message 
          });
          callbacks.onError && callbacks.onError(error);
        }
      );
    } catch (error) {
      this.stateManager.setState({
        isGeneratingVoice: false,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get state manager for UI binding
   */
  getStateManager() {
    return this.stateManager;
  }

  /**
   * Get translation engine for direct access
   */
  getTranslationEngine() {
    return this.translationEngine;
  }

  /**
   * Get voice engine for direct access
   */
  getVoiceEngine() {
    return this.voiceEngine;
  }
}

// Default export for easy importing
export default TranslationService;