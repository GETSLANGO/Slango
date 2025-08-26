/**
 * React Native Translation Screen Component
 * Uses the platform-agnostic translator.js core engine
 * This would be used in a React Native app
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';

// Import optimized mobile components
import { OptimizedButton, IconButton } from './OptimizedButton.jsx';
import { MobileTextInput } from './MobileTextInput.jsx';
import { MobileKeyboardAvoidingView } from './MobileKeyboardAvoidingView.jsx';

// Import platform-agnostic core - SAME FILE AS WEB VERSION
import TranslationService, { LANGUAGE_CONFIGS } from '../../translator.js';
import { createHttpClient } from '../../utils/api-client.js';
import { AudioManager } from '../../utils/audio.js';

// Verify we're using the exact same core engine
console.log('App using same translator.js:', Object.keys(LANGUAGE_CONFIGS).length, 'languages');

const { width, height } = Dimensions.get('window');

/**
 * Language Picker Component - Mobile Optimized
 */
const LanguagePicker = ({ selectedLanguage, onLanguageChange, languages, label }) => {
  const selectedConfig = LANGUAGE_CONFIGS[selectedLanguage];
  
  return (
    <View style={styles.languagePickerContainer}>
      <Text style={styles.languageLabel}>{label}</Text>
      <TouchableOpacity 
        style={styles.languagePicker}
        onPress={() => {
          // In real React Native app, this would open a picker modal
          // For now, we'll just cycle through languages
          const languageCodes = Object.keys(LANGUAGE_CONFIGS);
          const currentIndex = languageCodes.indexOf(selectedLanguage);
          const nextIndex = (currentIndex + 1) % languageCodes.length;
          onLanguageChange(languageCodes[nextIndex]);
        }}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.languageText}>
          {selectedConfig.flag} {selectedConfig.name}
        </Text>
        <Text style={styles.languageArrow}>▼</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Voice Button Component - Mobile Optimized
 */
const VoiceButton = ({ text, languageCode, isPlaying, onPlay, disabled }) => {
  const languageConfig = LANGUAGE_CONFIGS[languageCode];
  
  return (
    <OptimizedButton
      title={isPlaying ? 'Playing...' : `🔊 ${languageConfig?.flag}`}
      onPress={onPlay}
      disabled={disabled || !text.trim()}
      loading={isPlaying}
      variant="secondary"
      size="medium"
      style={styles.voiceButton}
    />
  );
};

/**
 * Main Translation Screen Component
 */
export const TranslationScreen = ({ navigation }) => {
  // Core service initialization
  const [translationService] = useState(() => {
    // In React Native, you'd configure the HTTP client for your specific setup
    const httpClient = createHttpClient('react-native', { 
      baseURL: 'https://your-api-endpoint.com' 
    });
    return new TranslationService({ httpClient });
  });

  const [audioManager] = useState(() => {
    // You'd pass the React Native audio library here
    return new AudioManager('react-native', { 
      audioLibrary: null // Would be Expo.Audio or react-native-sound
    });
  });

  // State management
  const [state, setState] = useState({
    sourceLanguage: 'standard_english',
    targetLanguage: 'gen_z_english',
    inputText: '',
    outputText: '',
    explanation: '',
    isTranslating: false,
    isPlayingInput: false,
    isPlayingOutput: false,
    error: null
  });

  // Subscribe to core state changes
  useEffect(() => {
    const stateManager = translationService.getStateManager();
    
    const unsubscribe = stateManager.subscribe((newState) => {
      setState(prevState => ({
        ...prevState,
        ...newState
      }));
    });

    return unsubscribe;
  }, [translationService]);

  // Translation handler
  const handleTranslate = useCallback(async () => {
    if (!state.inputText.trim()) {
      Alert.alert("Input Required", "Please enter some text to translate.");
      return;
    }

    try {
      await translationService.translate(
        state.inputText,
        state.sourceLanguage,
        state.targetLanguage
      );

      Alert.alert("Success", "Your text has been successfully translated!");
    } catch (error) {
      Alert.alert("Translation Error", error.message);
    }
  }, [state.inputText, state.sourceLanguage, state.targetLanguage, translationService]);

  // Language swap handler
  const handleSwapLanguages = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      sourceLanguage: prevState.targetLanguage,
      targetLanguage: prevState.sourceLanguage,
      inputText: prevState.outputText,
      outputText: prevState.inputText
    }));

    const stateManager = translationService.getStateManager();
    stateManager.swapLanguages();
  }, [translationService]);

  // Voice playback handlers
  const handlePlayVoice = useCallback(async (text, languageCode, isInput = false) => {
    const stateKey = isInput ? 'isPlayingInput' : 'isPlayingOutput';
    
    setState(prev => ({ ...prev, [stateKey]: true }));

    try {
      await translationService.playVoice(text, languageCode, {
        onPlay: () => {
          // Already set playing state above
        },
        onEnd: () => {
          setState(prev => ({ ...prev, [stateKey]: false }));
        },
        onError: (error) => {
          setState(prev => ({ ...prev, [stateKey]: false }));
          Alert.alert("Voice Error", "Unable to play audio. Please try again.");
        }
      });
    } catch (error) {
      setState(prev => ({ ...prev, [stateKey]: false }));
      console.error('Voice playback error:', error);
    }
  }, [translationService]);

  // Input change handler
  const handleInputChange = useCallback((text) => {
    setState(prev => ({ ...prev, inputText: text }));
    
    const stateManager = translationService.getStateManager();
    stateManager.setState({ inputText: text });
  }, [translationService]);

  // Language change handlers
  const handleSourceLanguageChange = useCallback((languageCode) => {
    setState(prev => ({ ...prev, sourceLanguage: languageCode }));
    const stateManager = translationService.getStateManager();
    stateManager.setState({ sourceLanguage: languageCode });
  }, [translationService]);

  const handleTargetLanguageChange = useCallback((languageCode) => {
    setState(prev => ({ ...prev, targetLanguage: languageCode }));
    const stateManager = translationService.getStateManager();
    stateManager.setState({ targetLanguage: languageCode });
  }, [translationService]);

  return (
    <MobileKeyboardAvoidingView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SlangSwap</Text>
        <Text style={styles.headerSubtitle}>Multilingual Translation</Text>
      </View>

      {/* Language Selection */}
      <View style={styles.languageSection}>
        <View style={styles.languageRow}>
          <LanguagePicker
            selectedLanguage={state.sourceLanguage}
            onLanguageChange={handleSourceLanguageChange}
            languages={Object.values(LANGUAGE_CONFIGS)}
            label="From"
          />
          
          <LanguagePicker
            selectedLanguage={state.targetLanguage}
            onLanguageChange={handleTargetLanguageChange}
            languages={Object.values(LANGUAGE_CONFIGS)}
            label="To"
          />
        </View>
        
        <IconButton 
          icon={<Text style={styles.swapButtonText}>⇄</Text>}
          onPress={handleSwapLanguages}
          size="large"
          style={styles.swapButton}
        />
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Input Text</Text>
          <VoiceButton
            text={state.inputText}
            languageCode={state.sourceLanguage}
            isPlaying={state.isPlayingInput}
            onPlay={() => handlePlayVoice(state.inputText, state.sourceLanguage, true)}
            disabled={state.isTranslating}
          />
        </View>
        
        <MobileTextInput
          value={state.inputText}
          onChangeText={handleInputChange}
          placeholder={`Type your ${LANGUAGE_CONFIGS[state.sourceLanguage]?.name || state.sourceLanguage} text here...`}
          multiline
          maxLength={5000}
          characterCount
          style={styles.textInputContainer}
          inputStyle={styles.textInput}
        />
        
        <View style={styles.inputFooter}>
          <OptimizedButton
            title="Translate"
            onPress={handleTranslate}
            disabled={state.isTranslating || !state.inputText.trim()}
            loading={state.isTranslating}
            variant="primary"
            size="large"
            style={styles.translateButton}
          />
        </View>
      </View>

      {/* Output Section */}
      <View style={styles.outputSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Translation</Text>
          <VoiceButton
            text={state.outputText}
            languageCode={state.targetLanguage}
            isPlaying={state.isPlayingOutput}
            onPlay={() => handlePlayVoice(state.outputText, state.targetLanguage, false)}
            disabled={state.isTranslating}
          />
        </View>
        
        <View style={styles.outputContainer}>
          {state.outputText ? (
            <View>
              <Text style={styles.outputText}>{state.outputText}</Text>
              
              {state.explanation && (
                <View style={styles.explanationContainer}>
                  <Text style={styles.explanationTitle}>Explanation</Text>
                  <Text style={styles.explanationText}>{state.explanation}</Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.placeholderText}>
              Translation will appear here...
            </Text>
          )}
        </View>
      </View>
    </MobileKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'center',
  },
  languageSection: {
    flexDirection: 'column',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    gap: 16,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  languagePickerContainer: {
    flex: 1,
  },
  languageLabel: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 10,
    fontWeight: '500',
  },
  languagePicker: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 18,
    borderWidth: 2,
    borderColor: '#374151',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 56,
  },
  languageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  languageArrow: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  swapButton: {
    backgroundColor: '#2563EB',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  swapButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  outputSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  voiceButton: {
    minWidth: 80,
  },
  textInputContainer: {
    marginVertical: 0,
  },
  textInput: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '500',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
  },
  translateButton: {
    minWidth: 140,
  },
  outputContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    minHeight: 140,
    borderWidth: 2,
    borderColor: '#374151',
  },
  outputText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
  },
  explanationContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  explanationTitle: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  explanationText: {
    color: '#9CA3AF',
    fontSize: 16,
    lineHeight: 24,
  },
  placeholderText: {
    color: '#6B7280',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    fontStyle: 'italic',
  },
});

export default TranslationScreen;