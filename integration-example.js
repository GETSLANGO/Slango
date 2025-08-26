/**
 * Integration Example - Shows how existing app integrates with modular architecture
 * This demonstrates the migration path from current implementation to platform-agnostic core
 */

// Current implementation approach (in client/src/pages/home.tsx)
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// NEW: Modular core engine approach
import TranslationService, { LANGUAGE_CONFIGS } from "./translator.js";
import { createHttpClient } from "./utils/api-client.js";
import { AudioManager } from "./utils/audio.js";

/**
 * Example 1: Current React Query approach (existing)
 */
function CurrentApproach() {
  const translateMutation = useMutation({
    mutationFn: async (text) => {
      const response = await apiRequest("POST", "/api/translate", { 
        inputText: text, 
        sourceLanguage: "standard_english",
        targetLanguage: "gen_z_english"
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Handle success in component
      setOutputText(data.outputText);
      setExplanation(data.explanation);
    }
  });
}

/**
 * Example 2: NEW Modular approach (migration target)
 */
function ModularApproach() {
  // Initialize once per app
  const translationService = new TranslationService({
    httpClient: createHttpClient('web', { baseURL: '' })
  });

  const audioManager = new AudioManager('web');

  // Subscribe to state changes (platform-agnostic)
  useEffect(() => {
    const stateManager = translationService.getStateManager();
    
    const unsubscribe = stateManager.subscribe((newState) => {
      // Auto-update React state from core state
      setOutputText(newState.outputText);
      setExplanation(newState.explanation);
      setIsTranslating(newState.isTranslating);
    });

    return unsubscribe;
  }, []);

  // Simple translation call
  const handleTranslate = async () => {
    try {
      await translationService.translate(
        inputText, 
        "standard_english", 
        "gen_z_english"
      );
      // State automatically updated via subscription
    } catch (error) {
      toast({ title: "Error", description: error.message });
    }
  };

  // Voice playback with platform abstraction
  const handlePlayVoice = async (text, languageCode) => {
    await translationService.playVoice(text, languageCode, {
      onPlay: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: (error) => toast({ title: "Voice Error", description: error.message })
    });
  };
}

/**
 * Example 3: Mobile React Native (same core logic)
 */
function ReactNativeApproach() {
  // EXACTLY the same core logic, different platform
  const translationService = new TranslationService({
    httpClient: createHttpClient('react-native', { 
      baseURL: 'https://your-api-endpoint.com' 
    })
  });

  const audioManager = new AudioManager('react-native', { 
    audioLibrary: ExpoAudio // or ReactNativeSound
  });

  // Same subscription pattern
  useEffect(() => {
    const stateManager = translationService.getStateManager();
    
    const unsubscribe = stateManager.subscribe((newState) => {
      // Auto-update React Native state
      setOutputText(newState.outputText);
      setExplanation(newState.explanation);
    });

    return unsubscribe;
  }, []);

  // IDENTICAL translation logic
  const handleTranslate = async () => {
    await translationService.translate(inputText, sourceLanguage, targetLanguage);
    // Zero code duplication!
  };
}

/**
 * Example 4: Migration Strategy - Hybrid Approach
 */
function HybridMigration() {
  // Keep existing React Query for now, add modular core alongside
  const translateMutation = useMutation({
    mutationFn: async (text) => {
      // Use new core engine within existing mutation
      const translationService = new TranslationService({
        httpClient: createHttpClient('web')
      });
      
      return await translationService.translate(text, sourceLanguage, targetLanguage);
    }
  });

  // Gradually migrate components to use core state manager
  // Eventually remove React Query dependency
}

/**
 * Language Configuration Comparison
 */

// OLD: Hard-coded in components
const LANGUAGE_OPTIONS = [
  { code: 'standard_english', name: 'Standard English', flag: '🇺🇸' },
  { code: 'gen_z_english', name: 'Gen Z Slang', flag: '🔥' }
];

// NEW: Centralized with voice configs
import { LANGUAGE_CONFIGS } from "./translator.js";
// Includes: voice IDs, voice settings, pronunciation configs
// Automatically synced across web, mobile, future platforms

/**
 * Voice System Comparison
 */

// OLD: Manual API calls in components
const playVoice = async (text, languageCode) => {
  const response = await fetch('/api/voice/generate', {
    method: 'POST',
    body: JSON.stringify({ text, targetLanguage: languageCode })
  });
  const audioBlob = await response.blob();
  const audio = new Audio(URL.createObjectURL(audioBlob));
  audio.play();
};

// NEW: Platform-abstracted voice system
const audioManager = new AudioManager('web');
await audioManager.playAudio(audioResponse, {
  onPlay: () => setIsPlaying(true),
  onEnd: () => setIsPlaying(false)
});

/**
 * Platform Detection Example
 */
import { detectPlatform, getPlatformConfig } from "./utils/platform-detector.js";

const platform = detectPlatform(); // 'web', 'react-native', 'node'
const config = getPlatformConfig(); // Platform-specific configurations

// Automatically configure services based on platform
const httpClient = createHttpClient(platform, config.api);
const storage = createStorage(platform, config.storage);
const audioManager = new AudioManager(platform, config.audio);

/**
 * Benefits Summary:
 * 
 * 1. ZERO LOGIC DUPLICATION
 *    - Translation logic written once in translator.js
 *    - Works on web, mobile, desktop, anywhere JavaScript runs
 * 
 * 2. SEAMLESS MIGRATION
 *    - Current React app keeps working
 *    - Gradually migrate to modular approach
 *    - React Native app uses same core logic
 * 
 * 3. GLOBAL SCALABILITY
 *    - Add new languages in one place
 *    - Voice configurations centralized
 *    - Platform capabilities automatically detected
 * 
 * 4. DEPLOYMENT READY
 *    - Web: Current Vite build process
 *    - Mobile: Copy core files to React Native project
 *    - PWA: Service worker support built-in
 *    - Future: Electron, Tauri, any platform
 */

export default {
  CurrentApproach,
  ModularApproach,
  ReactNativeApproach,
  HybridMigration
};