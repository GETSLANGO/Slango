/**
 * Web-specific Translation Interface Component
 * Uses the platform-agnostic translator.js core engine
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../../client/src/components/ui/card';
import { Button } from '../../client/src/components/ui/button';
import { Textarea } from '../../client/src/components/ui/textarea';
import { ArrowLeftRight, Volume2, Loader2 } from 'lucide-react';
import { useToast } from '../../client/src/hooks/use-toast';

// Import platform-agnostic core - SAME FILE AS MOBILE VERSION
import TranslationService, { LANGUAGE_CONFIGS } from '../../translator.js';
import { createHttpClient } from '../../utils/api-client.js';
import { AudioManager } from '../../utils/audio.js';

// Verify we're using the exact same core engine
console.log('Web using same translator.js:', Object.keys(LANGUAGE_CONFIGS).length, 'languages');

/**
 * Language Selector Component
 */
const LanguageSelector = ({ selectedLanguage, onLanguageChange, label, variant }) => {
  const languages = Object.values(LANGUAGE_CONFIGS);

  return (
    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3 border border-gray-600">
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-400">{label}</span>
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-transparent text-white text-lg font-medium border-none outline-none cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-gray-800">
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

/**
 * Voice Button Component
 */
const VoiceButton = ({ text, languageCode, isPlaying, onPlay, disabled }) => {
  const languageConfig = LANGUAGE_CONFIGS[languageCode];
  
  return (
    <Button
      onClick={onPlay}
      disabled={disabled || !text.trim()}
      variant="outline"
      size="sm"
      className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300"
    >
      {isPlaying ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
      <span className="ml-1 text-xs">{languageConfig?.flag}</span>
    </Button>
  );
};

/**
 * Main Translation Interface Component
 */
export const TranslationInterface = ({ className = '' }) => {
  // Core service initialization
  const [translationService] = useState(() => {
    const httpClient = createHttpClient('web', { baseURL: '' });
    return new TranslationService({ httpClient });
  });

  const [audioManager] = useState(() => new AudioManager('web'));

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

  const { toast } = useToast();

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

  // Initialize core state
  useEffect(() => {
    const stateManager = translationService.getStateManager();
    stateManager.setState({
      sourceLanguage: state.sourceLanguage,
      targetLanguage: state.targetLanguage
    });
  }, []);

  // Translation handler
  const handleTranslate = useCallback(async () => {
    if (!state.inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to translate.",
        variant: "destructive"
      });
      return;
    }

    try {
      await translationService.translate(
        state.inputText,
        state.sourceLanguage,
        state.targetLanguage
      );

      toast({
        title: "Translation Complete",
        description: "Your text has been successfully translated!"
      });
    } catch (error) {
      toast({
        title: "Translation Error",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [state.inputText, state.sourceLanguage, state.targetLanguage, translationService, toast]);

  // Language swap handler
  const handleSwapLanguages = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      sourceLanguage: prevState.targetLanguage,
      targetLanguage: prevState.sourceLanguage,
      inputText: prevState.outputText,
      outputText: prevState.inputText
    }));

    // Update core state
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
          toast({
            title: "Voice Error",
            description: "Unable to play audio. Please try again.",
            variant: "destructive"
          });
        }
      });
    } catch (error) {
      setState(prev => ({ ...prev, [stateKey]: false }));
      console.error('Voice playback error:', error);
    }
  }, [translationService, toast]);

  // Input change handler
  const handleInputChange = useCallback((e) => {
    const newText = e.target.value;
    setState(prev => ({ ...prev, inputText: newText }));
    
    // Update core state
    const stateManager = translationService.getStateManager();
    stateManager.setState({ inputText: newText });
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleTranslate();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleTranslate]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Language Selection Header */}
      <Card className="bg-gray-800 border-gray-700 shadow-2xl overflow-hidden">
        <div className="bg-gray-750 border-b border-gray-700 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LanguageSelector
              selectedLanguage={state.sourceLanguage}
              onLanguageChange={handleSourceLanguageChange}
              label="From"
              variant="source"
            />
            
            <LanguageSelector
              selectedLanguage={state.targetLanguage}
              onLanguageChange={handleTargetLanguageChange}
              label="To"
              variant="target"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center mt-4">
            <Button 
              onClick={handleSwapLanguages}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Translation Interface */}
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Input Section */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Input Text</h3>
                <VoiceButton
                  text={state.inputText}
                  languageCode={state.sourceLanguage}
                  isPlaying={state.isPlayingInput}
                  onPlay={() => handlePlayVoice(state.inputText, state.sourceLanguage, true)}
                  disabled={state.isTranslating}
                />
              </div>

              <Textarea
                value={state.inputText}
                onChange={handleInputChange}
                placeholder={`Type or paste your ${LANGUAGE_CONFIGS[state.sourceLanguage]?.name || state.sourceLanguage} text here...`}
                className="w-full h-72 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none text-lg leading-relaxed border-none custom-scrollbar"
                maxLength={5000}
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-400">
                  {state.inputText.length}/5000 characters
                </span>
                <Button
                  onClick={handleTranslate}
                  disabled={state.isTranslating || !state.inputText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {state.isTranslating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    'Translate'
                  )}
                </Button>
              </div>
            </div>

            {/* Output Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Translation</h3>
                <VoiceButton
                  text={state.outputText}
                  languageCode={state.targetLanguage}
                  isPlaying={state.isPlayingOutput}
                  onPlay={() => handlePlayVoice(state.outputText, state.targetLanguage, false)}
                  disabled={state.isTranslating}
                />
              </div>

              <div className="h-72 bg-gray-900 rounded-lg p-4 overflow-y-auto custom-scrollbar">
                {state.outputText ? (
                  <div className="space-y-4">
                    <div className="text-white text-lg leading-relaxed">
                      {state.outputText}
                    </div>
                    
                    {state.explanation && (
                      <div className="border-t border-gray-700 pt-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Explanation</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {state.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Translation will appear here...
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcut Hint */}
      <div className="text-center text-sm text-gray-500">
        Press <kbd className="px-2 py-1 bg-gray-700 rounded text-gray-300">Ctrl + Enter</kbd> to translate
      </div>
    </div>
  );
};

export default TranslationInterface;