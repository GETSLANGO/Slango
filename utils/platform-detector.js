/**
 * Platform Detection Utilities
 * Determines the current platform and provides appropriate configurations
 */

/**
 * Detect the current platform environment
 */
export function detectPlatform() {
  // React Native detection
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'react-native';
  }
  
  // Web browser detection
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return 'web';
  }
  
  // Node.js detection
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return 'node';
  }
  
  // Electron detection
  if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
    return 'electron';
  }
  
  return 'unknown';
}

/**
 * Detect device type
 */
export function detectDevice() {
  if (typeof window === 'undefined') {
    return 'unknown';
  }
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
  
  if (isTablet) return 'tablet';
  if (isMobile) return 'mobile';
  return 'desktop';
}

/**
 * Check platform capabilities
 */
export function getPlatformCapabilities() {
  const platform = detectPlatform();
  
  const capabilities = {
    platform,
    hasAudio: false,
    hasStorage: false,
    hasFileSystem: false,
    hasCamera: false,
    hasNotifications: false,
    hasVibration: false,
    hasGeolocation: false,
    supportsOffline: false
  };
  
  switch (platform) {
    case 'web':
      capabilities.hasAudio = typeof Audio !== 'undefined' || typeof AudioContext !== 'undefined';
      capabilities.hasStorage = typeof localStorage !== 'undefined';
      capabilities.hasFileSystem = typeof File !== 'undefined';
      capabilities.hasCamera = typeof navigator.mediaDevices !== 'undefined';
      capabilities.hasNotifications = typeof Notification !== 'undefined';
      capabilities.hasVibration = typeof navigator.vibrate !== 'undefined';
      capabilities.hasGeolocation = typeof navigator.geolocation !== 'undefined';
      capabilities.supportsOffline = 'serviceWorker' in navigator;
      break;
      
    case 'react-native':
      // React Native typically has all these capabilities
      capabilities.hasAudio = true;
      capabilities.hasStorage = true;
      capabilities.hasFileSystem = true;
      capabilities.hasCamera = true;
      capabilities.hasNotifications = true;
      capabilities.hasVibration = true;
      capabilities.hasGeolocation = true;
      capabilities.supportsOffline = true;
      break;
      
    case 'node':
      capabilities.hasFileSystem = true;
      capabilities.hasStorage = true;
      break;
  }
  
  return capabilities;
}

/**
 * Get platform-specific configuration
 */
export function getPlatformConfig() {
  const platform = detectPlatform();
  const device = detectDevice();
  const capabilities = getPlatformCapabilities();
  
  return {
    platform,
    device,
    capabilities,
    
    // API configuration
    api: {
      baseUrl: platform === 'web' ? '' : 'https://your-api-endpoint.com',
      timeout: platform === 'react-native' ? 15000 : 10000,
      retries: platform === 'web' ? 3 : 2
    },
    
    // Storage configuration
    storage: {
      type: platform === 'web' ? 'localStorage' : 'asyncStorage',
      persistent: platform !== 'web'
    },
    
    // Audio configuration
    audio: {
      format: platform === 'web' ? 'mp3' : 'aac',
      quality: device === 'mobile' ? 'standard' : 'high',
      cacheEnabled: platform === 'react-native'
    },
    
    // UI configuration
    ui: {
      theme: 'dark',
      animations: device !== 'mobile',
      hapticFeedback: platform === 'react-native',
      gestures: platform === 'react-native' || device === 'mobile'
    }
  };
}

/**
 * Platform-specific feature flags
 */
export function getFeatureFlags() {
  const { platform, device, capabilities } = getPlatformConfig();
  
  return {
    // Core features
    translation: true,
    voiceSynthesis: capabilities.hasAudio,
    offlineMode: capabilities.supportsOffline,
    
    // UI features
    darkMode: true,
    animations: device !== 'mobile',
    haptics: platform === 'react-native',
    
    // Advanced features
    cameraTranslation: capabilities.hasCamera,
    voiceInput: capabilities.hasAudio,
    pushNotifications: capabilities.hasNotifications,
    backgroundSync: platform === 'react-native',
    
    // Development features
    debugMode: process.env.NODE_ENV === 'development',
    analytics: process.env.NODE_ENV === 'production',
    crashReporting: platform === 'react-native'
  };
}

/**
 * Initialize platform-specific services
 */
export async function initializePlatform() {
  const config = getPlatformConfig();
  const features = getFeatureFlags();
  
  const services = {
    config,
    features,
    initialized: false,
    error: null
  };
  
  try {
    // Platform-specific initialization
    switch (config.platform) {
      case 'web':
        await initializeWebPlatform(config, features);
        break;
        
      case 'react-native':
        await initializeReactNativePlatform(config, features);
        break;
        
      case 'node':
        await initializeNodePlatform(config, features);
        break;
    }
    
    services.initialized = true;
  } catch (error) {
    services.error = error;
    console.error('Platform initialization failed:', error);
  }
  
  return services;
}

/**
 * Web platform initialization
 */
async function initializeWebPlatform(config, features) {
  // Initialize service worker for offline support
  if (features.offlineMode && 'serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (error) {
      console.warn('Service worker registration failed:', error);
    }
  }
  
  // Initialize audio context for better audio performance
  if (features.voiceSynthesis && typeof AudioContext !== 'undefined') {
    try {
      const audioContext = new AudioContext();
      // Resume audio context on user interaction
      document.addEventListener('click', () => {
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      }, { once: true });
    } catch (error) {
      console.warn('Audio context initialization failed:', error);
    }
  }
}

/**
 * React Native platform initialization
 */
async function initializeReactNativePlatform(config, features) {
  // Initialize React Native specific services
  // This would include things like:
  // - Audio session configuration
  // - Background task setup
  // - Push notification setup
  // - Crash reporting initialization
  
  console.log('React Native platform initialized');
}

/**
 * Node.js platform initialization
 */
async function initializeNodePlatform(config, features) {
  // Initialize Node.js specific services
  console.log('Node.js platform initialized');
}

/**
 * Platform compatibility check
 */
export function checkCompatibility() {
  const config = getPlatformConfig();
  const issues = [];
  
  // Check for required capabilities
  if (!config.capabilities.hasAudio) {
    issues.push('Audio playback not supported');
  }
  
  if (!config.capabilities.hasStorage) {
    issues.push('Data persistence not supported');
  }
  
  // Check for recommended capabilities
  const warnings = [];
  
  if (!config.capabilities.hasNotifications) {
    warnings.push('Push notifications not supported');
  }
  
  if (!config.capabilities.supportsOffline) {
    warnings.push('Offline mode not supported');
  }
  
  return {
    compatible: issues.length === 0,
    issues,
    warnings,
    config
  };
}

// Default export
export default {
  detectPlatform,
  detectDevice,
  getPlatformCapabilities,
  getPlatformConfig,
  getFeatureFlags,
  initializePlatform,
  checkCompatibility
};