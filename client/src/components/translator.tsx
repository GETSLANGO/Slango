import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useUser, SignInButton } from "@clerk/clerk-react";
import {
  ArrowRight,
  Copy,
  Volume2,
  Mic,
  MicOff,
  Loader2,
  BookmarkPlus,
  RotateCcw,
  Eraser,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export function Translator() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("standard_english");
  const [targetLanguage, setTargetLanguage] = useState("gen_z_english");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);
  const [spellSuggestions, setSpellSuggestions] = useState<{word: string, suggestions: string[], position: number}[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isLoaded, isSignedIn, user } = useUser();

  // Save translation mutation
  const saveTranslationMutation = useMutation({
    mutationFn: async (translationData: {
      inputText: string;
      outputText: string;
      sourceLanguage: string;
      targetLanguage: string;
    }) => {
      // Use apiRequest which already handles token properly
      const response = await apiRequest("POST", "/api/translations/save", {
        ...translationData,
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Translation Saved! 📚",
        description: "Added to your saved translations collection.",
      });
      // Invalidate and refetch saved translations immediately
      queryClient.invalidateQueries({ queryKey: ["/api/translations/saved"] });
      queryClient.refetchQueries({ queryKey: ["/api/translations/saved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/translations/history"] });
    },
    onError: (error: any) => {
      if (error.message?.includes('401') || error.message?.includes('authentication')) {
        toast({
          title: "Please Sign In",
          description: "You need to be signed in to save translations.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Save Failed",
        description: error.message || "Unable to save translation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!outputText.trim()) {
      toast({
        title: "Nothing to Save",
        description: "Please translate some text first before saving.",
        variant: "destructive",
      });
      return;
    }

    // Check if Clerk is loaded and user is signed in
    if (!isLoaded) {
      toast({
        title: "Please Wait",
        description: "Authentication is still loading. Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    if (!isSignedIn || !user) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to save translations.",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting save with auth state:', { isLoaded, isSignedIn, hasUser: !!user });

    saveTranslationMutation.mutate({
      inputText,
      outputText,
      sourceLanguage,
      targetLanguage,
    });
  };

  // Speech Recognition setup
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Voice Input Active 🎤",
          description: "Start speaking, and your words will appear in the input box.",
        });
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setInputText((prevText) => prevText + event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        // Optionally display interim transcript, might need a separate state for this
      };

      recognition.onend = () => {
        setIsListening(false);
        toast({
          title: "Voice Input Stopped 🛑",
          description: "Click the microphone icon to start listening again.",
        });
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        console.error("Speech recognition error:", event.error);
        toast({
          title: "Voice Input Error ⚠️",
          description: `There was an error with voice recognition: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };

      setRecognition(recognition);
    } else {
      toast({
        title: "Speech Recognition Not Supported 😞",
        description:
          "Your browser doesn't support speech recognition. Please try a different browser like Chrome.",
        variant: "destructive",
      });
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [toast]);

  const handleStartListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const handleStopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  // Translation mutation
  const translationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/translate", {
        inputText: inputText,
        sourceLanguage,
        targetLanguage,
      });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setOutputText(data.outputText);
    },
    onError: (error: any) => {
      toast({
        title: "Translation Failed",
        description: error.message || "Unable to translate. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTranslate = () => {
    translationMutation.mutate();
  };



  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied to Clipboard! ✅",
      description: "The translated text has been copied to your clipboard.",
    });
  };

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(outputText);
    speechSynthesis.speak(utterance);
  };

  const handleClearInput = () => {
    setInputText("");
    setSpellSuggestions([]);
  };

  const handleClearOutput = () => {
    setOutputText("");
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSpellSuggestions([]);
  };

  // Spell check functionality - only for Standard English
  const checkSpelling = async (text: string) => {
    if (sourceLanguage !== "standard_english" || !text.trim()) {
      setSpellSuggestions([]);
      return;
    }

    // Simple spell check using common misspellings dictionary
    const commonMisspellings: Record<string, string[]> = {
      'teh': ['the'],
      'recieve': ['receive'],
      'seperate': ['separate'],
      'definately': ['definitely'],
      'occured': ['occurred'],
      'accomodate': ['accommodate'],
      'beleive': ['believe'],
      'acheive': ['achieve'],
      'necesary': ['necessary'],
      'begining': ['beginning'],
      'existance': ['existence'],
      'appearence': ['appearance'],
      'occurence': ['occurrence'],
      'embarass': ['embarrass'],
      'harrass': ['harass'],
      'maintainance': ['maintenance'],
      'posession': ['possession'],
      'persue': ['pursue'],
      'privelege': ['privilege'],
      'tommorow': ['tomorrow'],
      'untill': ['until'],
      'wierd': ['weird'],
      'thier': ['their'],
      'freind': ['friend'],
      'goverment': ['government'],
      'enviroment': ['environment'],
      'independant': ['independent'],
      'judgement': ['judgment'],
      'liason': ['liaison'],
      'mispell': ['misspell'],
      'noticable': ['noticeable'],
      'publically': ['publicly'],
      'recomend': ['recommend'],
      'refered': ['referred'],
      'supercede': ['supersede'],
      'transfered': ['transferred'],
      'sucessful': ['successful'],
      'comming': ['coming'],
      'runing': ['running'],
      'stoping': ['stopping'],
      'planing': ['planning'],
      'writting': ['writing'],
      'geting': ['getting'],
      'puting': ['putting'],
      'cuting': ['cutting'],
      'hiting': ['hitting'],
      'siting': ['sitting'],
      'admiting': ['admitting'],
      'submiting': ['submitting'],
      'forgeting': ['forgetting'],
      'commited': ['committed'],
      'prefered': ['preferred'],
      'occuring': ['occurring'],
      'controled': ['controlled'],
      'benefited': ['benefited'],
      'quarantined': ['quarantined'],
      'fullfil': ['fulfill'],
      'skillfull': ['skillful'],
      'carefull': ['careful'],
      'usefull': ['useful'],
      'peacefull': ['peaceful'],
      'successfull': ['successful'],
      'wonderfull': ['wonderful'],
      'beautifull': ['beautiful'],
      'powerfull': ['powerful'],
      'harmfull': ['harmful'],
      'meaningfull': ['meaningful'],
      'gratefull': ['grateful'],
      'helpfull': ['helpful'],
    };

    const words = text.toLowerCase().split(/\s+/);
    const suggestions: {word: string, suggestions: string[], position: number}[] = [];

    words.forEach((word, index) => {
      // Remove punctuation for checking
      const cleanWord = word.replace(/[^a-z]/gi, '').toLowerCase();
      if (cleanWord && commonMisspellings[cleanWord]) {
        suggestions.push({
          word: cleanWord,
          suggestions: commonMisspellings[cleanWord],
          position: index
        });
      }
    });

    setSpellSuggestions(suggestions);
  };

  // Handle input text change with spell checking
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    
    // Debounce spell checking
    setTimeout(() => {
      checkSpelling(newText);
    }, 500);
  };

  // Clear spell suggestions when source language changes
  useEffect(() => {
    if (sourceLanguage !== "standard_english") {
      setSpellSuggestions([]);
    } else if (inputText.trim()) {
      checkSpelling(inputText);
    }
  }, [sourceLanguage]); // Remove inputText from dependencies to avoid infinite loops

  // Handle spell suggestion click
  const handleSuggestionClick = (originalWord: string, suggestion: string) => {
    const regex = new RegExp(`\\b${originalWord}\\b`, 'gi');
    const newText = inputText.replace(regex, suggestion);
    setInputText(newText);
    setSpellSuggestions(prev => prev.filter(s => s.word !== originalWord));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">Source</Badge>
            <LanguageSelector
              selectedLanguage={sourceLanguage}
              onLanguageChange={setSourceLanguage}
              label="From"
              variant="source"
            />
          </div>
          <div className="relative">
            <Textarea
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={handleInputChange}
              className="resize-none h-32"
              data-testid="input-text"
            />
            {/* Spell check suggestions - only for Standard English */}
            {sourceLanguage === "standard_english" && spellSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 p-2 bg-background border border-border rounded-md shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-foreground">Spelling suggestions:</span>
                </div>
                {spellSuggestions.map((suggestion, index) => (
                  <div key={`${suggestion.word}-${index}`} className="mb-2 last:mb-0">
                    <span className="text-sm text-muted-foreground">Did you mean </span>
                    {suggestion.suggestions.map((word, wordIndex) => (
                      <button
                        key={`${suggestion.word}-${word}-${wordIndex}`}
                        onClick={() => handleSuggestionClick(suggestion.word, word)}
                        className="text-sm text-primary hover:underline cursor-pointer mr-2"
                        data-testid={`suggestion-${suggestion.word}-${word}`}
                      >
                        <strong>{word}</strong>
                      </button>
                    ))}
                    <span className="text-sm text-muted-foreground">instead of "{suggestion.word}"?</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={handleClearInput}
              size="sm"
              variant="outline"
              className="space-x-1 hover:bg-gray-100 mobile-action-icon mobile-clear-icon"
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            <Button
              onClick={
                isListening ? handleStopListening : handleStartListening
              }
              size="sm"
              variant="outline"
              className="space-x-1 hover:bg-gray-100 mobile-action-icon mobile-mic-icon"
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span className="hidden sm:inline">Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span className="hidden sm:inline">Listen</span>
                </>
              )}
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Badge variant="secondary">Translation</Badge>
            <LanguageSelector
              selectedLanguage={targetLanguage}
              onLanguageChange={setTargetLanguage}
              label="To"
              variant="target"
            />
          </div>
          <Textarea
            readOnly
            placeholder="Translated text will appear here..."
            value={outputText}
            className="resize-none h-32 bg-gray-100 dark:bg-gray-700"
          />
          <div className="flex justify-end space-x-2 mobile-action-icons-container">
            <Button
              onClick={handleClearOutput}
              size="sm"
              variant="outline"
              className="space-x-1 hover:bg-gray-100 mobile-action-icon mobile-clear-icon"
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            <Button
              onClick={handleCopyToClipboard}
              size="sm"
              variant="outline"
              className="space-x-1 hover:bg-gray-100 mobile-action-icon mobile-copy-icon"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button
              onClick={handleSpeak}
              size="sm"
              variant="outline"
              className="space-x-1 hover:bg-gray-100 mobile-action-icon mobile-speaker-icon"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Speak</span>
            </Button>
          </div>
          <Separator />
          <div className="flex justify-between">
            <Button
              onClick={handleSwapLanguages}
              variant="secondary"
              className="space-x-1 hover:bg-gray-100"
            >
              <RotateCcw className="w-4 h-4" />
              Swap Languages
            </Button>
            <div className="flex space-x-2">
              <Button
                onClick={handleTranslate}
                disabled={
                  translationMutation.isPending || !inputText.trim()
                }
                className="space-x-1"
              >
                {translationMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    Translate
                  </>
                )}
              </Button>

              {isSignedIn ? (
                <Button
                  onClick={handleSave}
                  size="sm"
                  variant="ghost"
                  className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-gray-900 mobile-action-icon mobile-save-icon"
                  disabled={saveTranslationMutation.isPending || !outputText.trim()}
                >
                  {saveTranslationMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4 mr-1" />
                  )}
                  <span className="hidden sm:inline">Save</span>
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-gray-900 mobile-action-icon mobile-save-icon"
                    disabled={!outputText.trim()}
                  >
                    <BookmarkPlus className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}