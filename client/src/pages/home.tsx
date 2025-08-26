import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "react-router-dom";

// Import modular core engine
import { LANGUAGE_CONFIGS } from "../../../translator.js";
import { createHttpClient } from "../../../utils/api-client.js";
import { AudioManager } from "../../../utils/audio.js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  LanguageSelector,
  LANGUAGE_OPTIONS,
} from "@/components/ui/language-selector";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Languages,
  History,
  Bookmark,
  Bot,
  Zap,
  Flame,
  Flag,
  Hash,
  ArrowLeftRight,
  Mic,
  X,
  Volume2,
  VolumeX,
  Copy,
  Share,
  CheckCircle,
  Shuffle,
  Eraser,
  Info,
  ChevronDown,
  ChevronUp,
  Gauge,
  MessageSquare,
  Send,
} from "lucide-react";
import { LoginButton } from "@/components/ui/login-button";
import { SavedTranslationsModal } from "@/components/ui/saved-translations-modal";
import { HistoryTranslationsModal } from "@/components/ui/history-translations-modal";
import { ContactModal } from "@/components/ui/contact-modal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useUser, useAuth } from "@clerk/clerk-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// TypeScript declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

interface Translation {
  id: number;
  inputText: string;
  outputText: string;
  createdAt: string;
}

export default function Home() {
  const location = useLocation();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReversed, setIsReversed] = useState(false); // false = English to Gen Z, true = Gen Z to English
  const [sourceLanguage, setSourceLanguage] = useState("standard_english");
  const [targetLanguage, setTargetLanguage] = useState("gen_z_english");
  const [context, setContext] = useState("general");
  const [isAutoTranslating, setIsAutoTranslating] = useState(false);
  const [showSavedTranslations, setShowSavedTranslations] = useState(false);
  const [showHistoryTranslations, setShowHistoryTranslations] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [animatedDots, setAnimatedDots] = useState("");

  // Feedback form state
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  // For development in Replit, assume user is authenticated
  const isDevelopment = window.location.hostname.includes('.replit.dev') ||
                       window.location.hostname.includes('.replit.app');
  const effectiveIsSignedIn = isDevelopment || isSignedIn;
  const effectiveIsLoaded = isDevelopment || isLoaded;

  // Scroll to top when navigated to this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Fetch recent translations
  const { data: recentTranslations = [] } = useQuery<Translation[]>({
    queryKey: ["/api/translations/recent"],
  });

  // Auto-save to history mutation
  const autoSaveToHistoryMutation = useMutation({
    mutationFn: async ({
      inputText,
      outputText,
      sourceLanguage,
      targetLanguage,
    }: {
      inputText: string;
      outputText: string;
      sourceLanguage: string;
      targetLanguage: string;
    }) => {
      if (!effectiveIsLoaded || !effectiveIsSignedIn) {
        throw new Error("User not authenticated");
      }

      // Get Clerk session token for authentication
      let token = null;
      if (isSignedIn && !isDevelopment) {
        try {
          token = await getToken();
          console.log("History save token retrieved:", token ? "Yes" : "No");
        } catch (error) {
          console.error("Error getting token:", error);
        }
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/translations/history", {
        method: "POST",
        headers,
        body: JSON.stringify({
          inputText,
          outputText,
          sourceLanguage,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }

      return response.json();
    },
    onError: (error: any) => {
      // Silent error handling for auto-save - don't spam user with error messages
      console.error("Auto-save to history failed:", error);
    },
  });

  // Translation mutation using new abbreviation expansion system
  const translateMutation = useMutation({
    mutationFn: async (text: string) => {
      // Get the actual source and target languages from the current state
      const actualSource = sourceLanguage;
      const actualTarget = targetLanguage;

      // Log the values being sent to the API for debugging
      console.log("🔍 Translation API call:", {
        inputText: text,
        sourceLanguage: actualSource,
        targetLanguage: actualTarget,
        isReversed
      });

      // Always use the main translate endpoint with proper source and target languages
      const response = await apiRequest("POST", "/api/translate", {
        inputText: text,
        sourceLanguage: actualSource,
        targetLanguage: actualTarget,
        context: context
      });
      return response.json();
    },
    onSuccess: (data) => {
      setOutputText(data.translation || data.outputText || "");
      setExplanation(data.explanation || "");
      setShowExplanation(false); // Reset explanation visibility
      setPlaybackSpeed(1.0); // Reset speed to default on new translation

      // Auto-save every translation to history (only if authenticated)
      if (effectiveIsLoaded && effectiveIsSignedIn) {
        autoSaveToHistoryMutation.mutate({
          inputText: inputText,
          outputText: data.translation || data.outputText,
          sourceLanguage: sourceLanguage,
          targetLanguage: targetLanguage,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["/api/translations/recent"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/translations/history"],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Translation Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Save translation mutation
  const saveTranslationMutation = useMutation({
    mutationFn: async () => {
      if (!effectiveIsLoaded || !effectiveIsSignedIn) {
        throw new Error("User not authenticated");
      }

      const response = await apiRequest("POST", "/api/translations/save", {
        inputText,
        outputText,
        sourceLanguage,
        targetLanguage,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Translation Saved",
        description: "Translation has been saved to your collection.",
      });
      // Invalidate and refetch saved translations immediately
      queryClient.invalidateQueries({ queryKey: ["/api/translations/saved"] });
      queryClient.refetchQueries({ queryKey: ["/api/translations/saved"] });
    },
    onError: (error: any) => {
      if (error.message.includes("not authenticated")) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to save translations.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save translation.",
        variant: "destructive",
      });
    },
  });

  // Auto-translate function
  const autoTranslate = (text: string) => {
    if (!text.trim() || text.length > 5000) {
      return;
    }
    handleTranslateWithLoading(text);
  };

  // Custom translation handler with flicker prevention
  const handleTranslateWithLoading = async (text: string) => {
    let flickerTimer: number | undefined = undefined;
    
    // Keep current output until loading shows
    // Start loading after a brief delay to prevent flicker
    flickerTimer = window.setTimeout(() => setIsLoading(true), 120);
    
    try {
      await translateMutation.mutateAsync(text);
    } finally {
      if (flickerTimer) window.clearTimeout(flickerTimer);
      setIsLoading(false);
    }
  };

  // Debounce effect for auto-translation
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only set timer if there's input text
    if (inputText.trim().length > 0) {
      setIsAutoTranslating(true);
      debounceTimerRef.current = setTimeout(() => {
        setIsAutoTranslating(false);
        autoTranslate(inputText);
      }, 2000); // 2 second delay
    } else {
      // Clear output if input is empty
      setIsAutoTranslating(false);
      setOutputText("");
      setExplanation("");
      setShowExplanation(false);
    }

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setIsAutoTranslating(false);
    };
  }, [inputText, isReversed]); // Re-run when input text or direction changes

  // Auto-translate when target language changes (if there's existing input)
  useEffect(() => {
    // Only auto-translate if we have input text and aren't currently translating
    if (inputText.trim().length > 0 && !translateMutation.isPending) {
      // Clear any existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Translate immediately when language changes
      autoTranslate(inputText);

      toast({
        title: "Language Changed",
        description: `Auto-translating to ${LANGUAGE_OPTIONS.find(opt => opt.code === targetLanguage)?.name || targetLanguage}...`,
      });
    }
  }, [targetLanguage]); // Only trigger when target language changes

  // Animated dots effect for loading state
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (translateMutation.isPending) {
      let dotCount = 0;
      interval = setInterval(() => {
        dotCount = (dotCount + 1) % 4; // Cycle through 0, 1, 2, 3
        setAnimatedDots(".".repeat(dotCount));
      }, 500);
    } else {
      setAnimatedDots("");
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [translateMutation.isPending]);

  const handleTranslate = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to translate.",
        variant: "destructive",
      });
      return;
    }

    if (inputText.length > 5000) {
      toast({
        title: "Text Too Long",
        description: "Please limit your text to 5000 characters.",
        variant: "destructive",
      });
      return;
    }

    // Clear debounce timer and translate immediately
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    handleTranslateWithLoading(inputText);
    toast({
      title: "Translating...",
      description: "Manual translation triggered.",
    });
  };

  const handleClear = () => {
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setInputText("");
    setOutputText("");
    setExplanation("");
    setShowExplanation(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Text copied to clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Unable to copy text to clipboard.",
          variant: "destructive",
        });
      });
  };

  const handleTryExample = () => {
    // Examples organized by SOURCE language (what goes in the input box)
    const examplesBySourceLanguage: Record<string, string[]> = {
      standard_english: [
        "I'm going to sleep now.",
        "Hello, how are you doing today?",
        "That's very impressive!",
        "This food tastes amazing!",
        "I need to study for my exam tomorrow.",
        "That's really cool and I'm excited about it!",
      ],
      gen_z_english: [
        "That drip is fire fr 🔥",
        "yo what's good? how u vibin' today?",
        "bro that hits different ngl",
        "I'm bout to sleep, I'm dead rn",
        "this food is bussin no cap",
        "gotta lock in and study for my exam tomorrow fr",
      ],
      formal_english: [
        "I am pleased to inform you of this remarkable development.",
        "Good morning, I trust you are in excellent health today?",
        "That is indeed most commendable and praiseworthy!",
        "I shall retire for the evening forthwith.",
        "This cuisine is exceptionally exquisite!",
        "I must prepare diligently for tomorrow's examination.",
      ],
      millennial_english: [
        "I gotta grind through this Monday",
        "Hey there! What's up? How's your day going?",
        "That's actually pretty legit, not gonna lie!",
        "I'm totally wiped out, time for bed.",
        "This food is straight up amazing!",
        "Ugh, I really need to study for this test tomorrow.",
      ],
      british_english: [
        "That's absolutely brilliant, I'm chuffed to bits!",
        "Alright mate? How are you getting on today?",
        "That's proper impressive, that is!",
        "Right, I'm off to bed now, knackered I am.",
        "This grub is absolutely smashing!",
        "I've got to revise for my exam tomorrow, haven't I?",
      ],
      spanish: [
        "Necesito estudiar para mi examen mañana.",
        "¡Hola! ¿Cómo estás hoy?",
        "¡Eso es muy impresionante!",
        "Me voy a dormir ahora.",
        "¡Esta comida está deliciosa!",
        "¡Eso está muy bueno y estoy emocionado!",
      ],
      french: [
        "Je dois étudier pour mon examen demain.",
        "Bonjour, comment allez-vous aujourd'hui?",
        "C'est très impressionnant!",
        "Je vais dormir maintenant.",
        "Cette nourriture est délicieuse!",
        "C'est vraiment cool et je suis excité!",
      ],
      aave: [
        "That's real nice and I'm hype about it!",
        "Hey, what's good? How you been today?",
        "That's mad impressive fo'real!",
        "I'm finna go to sleep now.",
        "This food taste real good!",
        "I gotta study for my test tomorrow.",
      ],
    };

    // Use the current sourceLanguage directly from state
    const examples = examplesBySourceLanguage[sourceLanguage];

    if (examples && examples.length > 0) {
      const randomExample = examples[Math.floor(Math.random() * examples.length)];
      setInputText(randomExample);
    } else {
      // Show a toast message for languages without examples
      const sourceLangName = LANGUAGE_OPTIONS.find(l => l.code === sourceLanguage)?.name || sourceLanguage;
      toast({
        title: "Examples coming soon",
        description: `Examples for ${sourceLangName} language are coming soon!`,
        variant: "default",
      });
    }
  };

  // Feedback form submission handler
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackText.trim() || feedbackText.length > 500) {
      return;
    }

    setFeedbackLoading(true);
    setFeedbackError("");
    setFeedbackSuccess(false);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: feedbackText.trim(),
          type: "feedback"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit feedback");
      }

      const result = await response.json();
      setFeedbackSuccess(true);
      setFeedbackText("");

      toast({
        title: "Feedback Sent!",
        description: result.message || "Thank you for helping us improve Slango.",
      });

      // Clear success message after 5 seconds
      setTimeout(() => setFeedbackSuccess(false), 5000);

    } catch (error: any) {
      setFeedbackError(error.message || "Failed to submit feedback. Please try again.");
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleSaveTranslation = async () => {
    if (!effectiveIsLoaded || !effectiveIsSignedIn) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save translations.",
        variant: "destructive",
      });
      return;
    }

    if (!inputText || !outputText) {
      toast({
        title: "Nothing to Save",
        description: "Please complete a translation first.",
        variant: "destructive",
      });
      return;
    }

    saveTranslationMutation.mutate();
  };

  const handleLoadTranslation = (
    loadedInputText: string,
    loadedOutputText: string,
    loadedSourceLanguage: string,
    loadedTargetLanguage: string,
  ) => {
    setInputText(loadedInputText);
    setOutputText(loadedOutputText);
    setSourceLanguage(loadedSourceLanguage);
    setTargetLanguage(loadedTargetLanguage);
    setExplanation("");
    setShowExplanation(false);
  };

  // Share functionality
  const handleShareInput = async () => {
    if (!inputText) {
      toast({
        title: "Nothing to Share",
        description: "Please enter some text first.",
        variant: "destructive",
      });
      return;
    }

    const shareData = {
      title: "Slango - Text to Translate",
      text: `Check out this text I want to translate: "${inputText}"`,
      url: window.location.href,
    };

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: "Text shared using your device's share feature.",
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text} - ${shareData.url}`,
        );
        toast({
          title: "Copied to Clipboard",
          description: "Share text has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast({
        title: "Share Failed",
        description: "Unable to share. Try copying the text manually.",
        variant: "destructive",
      });
    }
  };

  const handleShareTranslation = async () => {
    if (!outputText || !inputText) {
      toast({
        title: "Nothing to Share",
        description: "Please complete a translation first.",
        variant: "destructive",
      });
      return;
    }

    const sourceLanguageName =
      LANGUAGE_OPTIONS.find((opt) => opt.code === sourceLanguage)?.name ||
      sourceLanguage;
    const targetLanguageName =
      LANGUAGE_OPTIONS.find((opt) => opt.code === targetLanguage)?.name ||
      targetLanguage;

    const shareData = {
      title: "Slango - Translation Result",
      text: `Check out this translation from ${sourceLanguageName} to ${targetLanguageName}:\n\nOriginal: "${inputText}"\nTranslation: "${outputText}"\n\nTry Slango yourself!`,
      url: window.location.href,
    };

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        toast({
          title: "Translation Shared",
          description: "Translation shared using your device's share feature.",
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`,
        );
        toast({
          title: "Copied to Clipboard",
          description: "Translation has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast({
        title: "Share Failed",
        description: "Unable to share. Try copying the text manually.",
        variant: "destructive",
      });
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getRecognitionLanguage(sourceLanguage);

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "🎤 Listening...",
          description: "Speak now, I'm converting your speech to text",
        });
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        toast({
          title: "✅ Speech Captured",
          description: `Converted: "${transcript.substring(0, 50)}${transcript.length > 50 ? "..." : ""}"`,
        });
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        let errorMessage = "Speech recognition failed. Please try again.";

        if (event.error === "not-allowed") {
          errorMessage =
            "Microphone access denied. Please allow microphone permissions.";
        } else if (event.error === "no-speech") {
          errorMessage = "No speech detected. Please try speaking again.";
        } else if (event.error === "network") {
          errorMessage = "Network error. Please check your connection.";
        }

        toast({
          title: "Speech Recognition Error",
          description: errorMessage,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [sourceLanguage, toast]);

  const getRecognitionLanguage = (languageCode: string): string => {
    const languageMap: Record<string, string> = {
      standard_english: "en-US",
      formal_english: "en-US",
      gen_z_english: "en-US",
      millennial_english: "en-US",
      british_english: "en-GB",

      spanish: "es-ES",
      french: "fr-FR",
    };
    return languageMap[languageCode] || "en-US";
  };

  const handleMicrophoneClick = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Supported",
        description:
          "Your browser doesn't support speech recognition. Try using Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Update language setting before starting recognition
      recognitionRef.current.lang = getRecognitionLanguage(sourceLanguage);
      recognitionRef.current.start();
    }
  };

  const handlePlayAudio = async () => {
    if (!outputText) {
      toast({
        title: "No Text to Play",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    try {
      // Try ElevenLabs custom male voice first
      const response = await fetch("/api/voice/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: outputText,
          targetLanguage: targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Voice generation failed: ${response.status}`);
      }

      // Get the audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create audio element and play
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);

      // Apply playback speed
      audio.playbackRate = playbackSpeed;

      audio.onloadstart = () => {
        const targetOption = LANGUAGE_OPTIONS.find(
          (opt) => opt.code === targetLanguage,
        );
        toast({
          title: `🔊 ${targetOption?.name || "Custom"} Voice`,
          description: `Authentic pronunciation for ${targetOption?.name || targetLanguage} delivery`,
        });
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        console.log("ElevenLabs audio failed, using enhanced browser voice");
        handleEnhancedBrowserVoice();
      };

      // Start playing the custom voice audio
      await audio.play();
    } catch (error) {
      setIsPlaying(false);
      console.error("ElevenLabs voice generation error:", error);

      // Fallback to enhanced browser voice
      handleEnhancedBrowserVoice();
    }
  };

  // Enhanced browser speech synthesis with natural speech patterns
  const handleEnhancedBrowserVoice = () => {
    if (!("speechSynthesis" in window)) {
      toast({
        title: "Audio Not Supported",
        description: "Your browser doesn't support voice playback.",
        variant: "destructive",
      });
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();
    setIsPlaying(true);

    // Preprocess text for more natural speech (same as ElevenLabs preprocessing)
    let speechText = outputText
      .replace(/\bfr\b/gi, "for real")
      .replace(/\bngl\b/gi, "not gonna lie")
      .replace(/\btbh\b/gi, "to be honest")
      .replace(/\bidk\b/gi, "I don't know")
      .replace(/\bomg\b/gi, "oh my god")
      .replace(/\blowkey\b/gi, "low key")
      .replace(/\bhighkey\b/gi, "high key")
      .replace(/\bno cap\b/gi, "no cap")
      .replace(/\bfacts\b/gi, "facts")
      .replace(/\bbussin\b/gi, "bussin'")
      .replace(/\bvibin\b/gi, "vibing")
      .replace(/💀/g, "")
      .replace(/🔥/g, "")
      .replace(/💯/g, "")
      .replace(/✨/g, "")
      .replace(/😭/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(speechText);

    // Apply playback speed to speech synthesis
    utterance.rate = playbackSpeed;

    // Get voices and wait for them to load if needed
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", () => {
        voices = window.speechSynthesis.getVoices();
      });
    }

    // Advanced voice selection for most natural American speech
    const findOptimalVoice = (voices: any[]) => {
      // Priority for natural-sounding voices
      const malePreferences = [
        "Microsoft David Desktop - English (United States)",
        "Microsoft Mark Desktop - English (United States)",
        "Alex", // macOS natural male voice
        "Google US English Male",
        "Microsoft David - English (United States)",
      ];

      const femalePreferences = [
        "Microsoft Zira Desktop - English (United States)",
        "Microsoft Hazel Desktop - English (United States)",
        "Samantha", // macOS natural female voice
        "Google US English Female",
        "Microsoft Zira - English (United States)",
      ];

      // Always prioritize male voices for consistent brand voice
      const preferences = malePreferences;

      // Try exact matches first
      for (const preferredName of preferences) {
        const voice = voices.find((v: any) => v.name === preferredName);
        if (voice) return voice;
      }

      // Then try partial matches for neural/enhanced voices
      const neuralVoice = voices.find(
        (v: any) =>
          v.lang.startsWith("en-US") &&
          (v.name.toLowerCase().includes("neural") ||
            v.name.toLowerCase().includes("enhanced") ||
            v.name.toLowerCase().includes("natural")),
      );
      if (neuralVoice) return neuralVoice;

      // Look for high-quality local voices
      const localVoice = voices.find(
        (v: any) =>
          v.lang.startsWith("en-US") &&
          v.localService &&
          (v.name.includes("Samantha") || v.name.includes("Alex")),
      );
      if (localVoice) return localVoice;

      // Fallback to best available US English voice
      return (
        voices.find((v: any) => v.lang.startsWith("en-US")) ||
        voices.find((v: any) => v.lang.startsWith("en"))
      );
    };

    const selectedVoice = findOptimalVoice(voices);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Configure for natural, warm speech patterns
    if (isReversed) {
      // Standard English - clear and authoritative
      utterance.rate = 0.8; // Slower for clarity and gravitas
      utterance.pitch = 0.85; // Lower pitch for authority
      utterance.volume = 1.0;
    } else {
      // Gen Z slang - casual and natural
      utterance.rate = 0.9; // Natural conversational pace
      utterance.pitch = 1.0; // Normal pitch for relatability
      utterance.volume = 1.0;
    }

    utterance.onstart = () => {
      const voiceQuality =
        selectedVoice &&
        (selectedVoice.name.includes("Neural") ||
          selectedVoice.name.includes("Enhanced") ||
          selectedVoice.name.includes("Samantha") ||
          selectedVoice.name.includes("Alex") ||
          selectedVoice.name.includes("David") ||
          selectedVoice.name.includes("Zira"))
          ? "High-Quality"
          : "Standard";

      toast({
        title: `🔊 ${voiceQuality} Natural Voice`,
        description: isReversed
          ? `Enhanced American English with optimized speech patterns (${selectedVoice?.name || "System voice"})`
          : `Natural Gen Z pronunciation with expanded abbreviations (${selectedVoice?.name || "System voice"})`,
      });
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
      toast({
        title: "Audio Playback Failed",
        description: "Voice playback is not available on this device.",
        variant: "destructive",
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  // Handle playback speed changes
  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);

    // If audio is currently playing, apply speed change immediately
    if (currentAudio) {
      currentAudio.playbackRate = newSpeed;
    }

    // If speech synthesis is playing, we need to restart with new speed
    if (isPlaying && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        handleEnhancedBrowserVoice();
      }, 100); // Small delay to ensure cancellation completes
    }
  };

  const handleSwapLanguages = () => {
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Swap the input and output text
    const tempInput = inputText;
    setInputText(outputText);
    setOutputText(tempInput);

    // Swap the languages - this will immediately update the dropdowns
    const tempSource = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempSource);

    // Clear explanation when swapping
    setExplanation("");
    setShowExplanation(false);

    // Toggle the direction
    setIsReversed(!isReversed);

    //    // Stop any playing audio
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const trendingPhrases = [
    { phrase: "It's bussin", tag: "🔥 Hot" },
    { phrase: "No cap", tag: "💯 Truth" },
    { phrase: "It's giving...", tag: "✨ Vibes" },
    { phrase: "Slay queen", tag: "👑 Empowerment" },
  ];

  return (
    <div className="slango-text min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="glass-panel border-b border-border shadow-lg w-full">
        <div className="flex items-center justify-between flex-wrap gap-x-2 h-12 sm:h-14 lg:h-16 px-2 sm:px-4 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0 min-w-0">
              <div className="flex-shrink-0">
                <Languages className="text-primary slango-glow text-base sm:text-lg md:text-xl lg:text-2xl" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl slango-brand truncate">SLANGO</h1>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
              <Link to="/about">
                <button
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-1 slango-glow-hover p-1 sm:p-2"
                >
                  <span className="text-xs sm:text-sm slango-text font-medium">
                    About Us
                  </span>
                </button>
              </Link>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <ThemeToggle />
                <LoginButton />
              </div>
            </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden py-12 bg-gradient-to-br from-background via-muted/30 to-background border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.1)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-5">

        </div>
        <div className="relative max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 text-center w-full">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
              <span className="block text-muted-foreground font-[Orbitron] mb-2">
                DON'T SPEAK IT.
              </span>
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent font-[Orbitron] slango-glow">
                SLANG IT.
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed slango-text">
              Transform any language into the perfect vibe. From formal to fire, we've got your communication covered.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </section>

      <main className="max-w-7xl mx-auto px-1 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full max-w-full overflow-hidden">

        {/* Main Translation Interface - Locked 2-Column Layout */}
        <Card className="glass-panel shadow-2xl overflow-hidden w-full max-w-full min-w-0">
          {/* Language Selectors Row - Locked Layout */}
          <div className="p-3 sm:p-4 border-b border-border max-w-full overflow-hidden">
            <div className="flex items-end justify-between gap-0 sm:gap-1 md:gap-2 max-w-full overflow-hidden">
              {/* From Language Selector - Extended to align with SWITCH button */}
              <div className="flex-1 min-w-0 max-w-[44%]">
                <LanguageSelector
                  selectedLanguage={sourceLanguage}
                  onLanguageChange={setSourceLanguage}
                  label="From"
                  variant="source"
                />
              </div>

              {/* Swap Button - Centered with minimal space */}
              <div className="flex justify-center items-center flex-shrink-0 px-0 sm:px-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleSwapLanguages}
                        className="slango-button-primary p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-xl min-w-[40px] min-h-[40px]"
                        size="icon"
                      >
                        <ArrowLeftRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Swap input/output and languages</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* To Language Selector - Extended to align with SWITCH button */}
              <div className="flex-1 min-w-0 max-w-[44%]">
                <LanguageSelector
                  selectedLanguage={targetLanguage}
                  onLanguageChange={setTargetLanguage}
                  label="To"
                  variant="target"
                />
              </div>
            </div>
          </div>

          {/* Translation Areas - Mobile: Stacked, Desktop: 2-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 relative max-w-full overflow-hidden min-w-0">
            {/* Input Section - Mobile: Full Width, Desktop: Left */}
            <div className="p-1 sm:p-2 md:p-1 lg:p-2 xl:p-3 border-b md:border-b-0 md:border-r border-border relative w-full min-w-0">

              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <label className="text-xs font-medium text-muted-foreground slango-text">
                  Input
                </label>
                <div className="flex items-center space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleMicrophoneClick}
                          className={`transition-colors ${
                            isListening
                              ? "text-destructive hover:text-destructive/80"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                          title={
                            isListening
                              ? "Stop listening"
                              : "Start speech-to-text"
                          }
                        >
                          <Mic
                            className={`w-4 h-4 sm:w-4 sm:h-4 ${isListening ? "animate-pulse" : ""}`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isListening
                            ? "🔴 Recording... Click to stop"
                            : "🎤 Click to speak and convert speech to text"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <button
                    onClick={handleClear}
                    className="text-muted-foreground hover:text-primary transition-colors slango-glow-hover"
                    title="Clear"
                  >
                    <X className="w-4 h-4 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type it. We'll slang it.`}
                className="w-full h-32 sm:h-36 md:h-32 lg:h-40 xl:h-48 bg-transparent text-foreground placeholder-muted-foreground resize-none focus:outline-none text-sm sm:text-base md:text-sm lg:text-base leading-relaxed border-none slango-text custom-scrollbar"
                maxLength={5000}
              />

              <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 md:left-2 right-1 sm:right-2 md:right-2 flex items-center justify-between text-xs mobile-bottom-actions">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-muted-foreground slango-text">
                    {inputText.length} / 5000
                  </span>
                  {isAutoTranslating && (
                    <span className="text-primary animate-pulse flex items-center slango-text">
                      <div className="w-1 h-1 sm:w-2 sm:h-2 bg-primary rounded-full mr-1 animate-ping"></div>
                      Auto...
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1 mobile-action-icons-container">
                  <button
                    onClick={() => handleCopy(inputText)}
                    className="text-muted-foreground hover:text-primary transition-colors slango-glow-hover mobile-action-icon mobile-copy-icon"
                    title="Copy"
                    disabled={!inputText}
                  >
                    <Copy className="w-4 h-4 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleShareInput()}
                    className="text-muted-foreground hover:text-primary transition-colors slango-glow-hover mobile-action-icon mobile-share-icon"
                    title="Share input text"
                  >
                    <Share className="w-4 h-4 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Output Section - Mobile: Full Width, Desktop: Right */}
            <div className="p-1 sm:p-2 md:p-1 lg:p-2 xl:p-3 relative w-full min-w-0">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <label className="text-xs font-medium text-muted-foreground slango-text">
                  Output
                </label>
                <div className="flex items-center space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handlePlayAudio}
                          className={`transition-colors slango-glow-hover ${
                            isPlaying
                              ? "text-primary hover:text-primary/80"
                              : "text-muted-foreground hover:text-primary"
                          } ${!outputText || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={!outputText || isLoading}
                          aria-disabled={!outputText || isLoading}
                        >
                          {isPlaying ? (
                            <VolumeX className="w-4 h-4 sm:w-4 sm:h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4 sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isPlaying
                            ? "Stop neural voice playback"
                            : isReversed
                              ? "🔊 Custom neural voice: Natural American English"
                              : "🔊 Custom neural voice: Authentic Gen Z pronunciation"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Speed Control - Simplified for mobile */}
                  {outputText && (
                    <div className="hidden sm:flex items-center space-x-1">
                      <Gauge className="w-3 h-3 text-muted-foreground" />
                      <Select
                        value={playbackSpeed.toString()}
                        onValueChange={(value) => handleSpeedChange(parseFloat(value))}
                      >
                        <SelectTrigger className="h-5 w-12 text-xs bg-transparent border-muted-foreground/30 text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="min-w-16">
                          <SelectItem value="0.5" className="text-xs">0.5x</SelectItem>
                          <SelectItem value="0.75" className="text-xs">0.75x</SelectItem>
                          <SelectItem value="1.0" className="text-xs">1.0x</SelectItem>
                          <SelectItem value="1.25" className="text-xs">1.25x</SelectItem>
                          <SelectItem value="1.5" className="text-xs">1.5x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <button
                    onClick={handleSaveTranslation}
                    className={`transition-colors slango-glow-hover ${
                      !outputText || !inputText || isLoading
                        ? "text-muted-foreground/50 cursor-not-allowed"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    title={
                      effectiveIsSignedIn
                        ? "Save translation"
                        : "Login to save translations"
                    }
                    disabled={!outputText || !inputText || isLoading}
                    aria-disabled={!outputText || !inputText || isLoading}
                  >
                    <Bookmark className="w-4 h-4 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              <div className="w-full min-h-[8rem] sm:min-h-[9rem] md:min-h-[8rem] lg:min-h-[10rem] xl:min-h-[12rem] flex flex-col text-foreground text-sm sm:text-base md:text-sm lg:text-base leading-relaxed slango-text overflow-hidden">
                <div
                  className="w-full h-full flex items-start md:items-center justify-start md:justify-center"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {isLoading ? (
                    <div className="sl-loading-dots text-slate-400/90
                                    text-base sm:text-lg md:text-xl lg:text-2xl
                                    font-medium select-none">
                      Translating<span className="dot">.</span>
                      <span className="dot">.</span>
                      <span className="dot">.</span>
                    </div>
                  ) : outputText ? (
                    <div className="flex flex-col space-y-2 w-full">
                      {/* Translation Output - Always Visible */}
                      <div className="flex-shrink-0">
                        <div
                          className={`translation-output text-foreground transition-all duration-300 slango-text whitespace-pre-wrap break-words text-base sm:text-lg md:text-xl lg:text-2xl ${
                            isPlaying ? "scale-105 text-primary" : ""
                          }`}
                        >
                          {outputText}
                          {isPlaying && (
                            <span className="flex items-center">
                              <div
                                className="w-1 h-1 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse ml-1"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="w-1 h-1 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse ml-1"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Context Section - Simple and Clear */}
                      {explanation && (
                        <div className="flex-shrink-0 space-y-1">
                          <button
                            onClick={() =>
                              setShowExplanation(!showExplanation)
                            }
                            className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors text-xs group slango-glow-hover"
                          >
                            <Info className="w-3 h-3" />
                            <span>Context</span>
                            {showExplanation ? (
                              <ChevronUp className="w-3 h-3 group-hover:text-primary" />
                            ) : (
                              <ChevronDown className="w-3 h-3 group-hover:text-primary" />
                            )}
                          </button>

                          {/* Context Explanation - Fixed Height with Scrolling */}
                          {showExplanation && (
                            <div
                              className="glass-panel rounded p-2 border-l-2 border-primary animate-in slide-in-from-top-2 duration-200 overflow-y-auto overflow-x-hidden max-w-full"
                              style={{ height: '180px' }}
                            >
                              <div className="text-foreground text-sm sm:text-base md:text-[17px] lg:text-[18px] leading-relaxed mt-2 break-words slango-text min-w-0">
                                {explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap break-words text-base sm:text-lg md:text-xl lg:text-2xl">
                      <span className="text-slate-400/70">Your Gen Z translation will appear here…</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 md:left-2 right-1 sm:right-2 md:right-2 flex items-center justify-between text-xs mobile-bottom-actions">
                <div className="flex items-center space-x-1">
                  {outputText && (
                    <>
                      <CheckCircle className="text-primary w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-muted-foreground slango-text hidden sm:inline">
                        Translated
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-1 mobile-action-icons-container">
                  <button
                    onClick={() => handleCopy(outputText)}
                    className="text-muted-foreground hover:text-primary transition-colors slango-glow-hover mobile-action-icon mobile-copy-icon"
                    title="Copy translation"
                    disabled={!outputText || isLoading}
                    aria-disabled={!outputText || isLoading}
                  >
                    <Copy className="w-4 h-4 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleShareTranslation()}
                    className="text-muted-foreground hover:text-primary transition-colors slango-glow-hover mobile-action-icon mobile-share-icon"
                    title="Share translation"
                    disabled={isLoading}
                    aria-disabled={isLoading}
                  >
                    <Share className="w-4 h-4 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Swap Button - Centered between columns */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              {/* Hidden on mobile due to space constraints, shown on larger screens */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="glass-panel border-t border-border p-6">
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 mt-4">
                  <button
                    onClick={() => setShowSavedTranslations(true)}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 slango-glow-hover"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span className="text-sm slango-text font-medium">Saved</span>
                  </button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleTryExample}
                      className="slango-button-secondary font-medium"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Try Example
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get an example in {LANGUAGE_OPTIONS.find(l => l.code === (isReversed ? targetLanguage : sourceLanguage))?.name || 'the selected language'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
                  <button
                    onClick={() => setShowHistoryTranslations(true)}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 slango-glow-hover"
                  >
                    <History className="w-4 h-4" />
                    <span className="text-sm slango-text font-medium">History</span>
                  </button>

            </div>
          </div>
        </Card>

        {/* Additional Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feedback/Ideas Card */}
          <Card className="glass-panel hover:border-primary transition-all duration-300 slango-glow-hover">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <MessageSquare className="text-green-500 mr-2 w-5 h-5" />
                  Got slang ideas or feedback? Tell us here!
                </h3>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your slang ideas, report issues, or give us feedback to make Slango better..."
                  className="w-full min-h-[100px] p-3 rounded-lg bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none text-sm"
                  disabled={feedbackLoading}
                />
                <div className="flex items-center justify-between">
                  <span className={`text-xs transition-colors ${
                    feedbackText.length > 500
                      ? 'text-red-500'
                      : feedbackText.length > 400
                        ? 'text-yellow-500'
                        : 'text-muted-foreground'
                  }`}>
                    {feedbackText.length}/500 characters
                  </span>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!feedbackText.trim() || feedbackLoading || feedbackText.length > 500}
                    className="slango-button-primary"
                  >
                    {feedbackLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {feedbackSuccess && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm">Thanks! Your feedback helps us improve Slango.</p>
                </div>
              )}

              {feedbackError && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{feedbackError}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Phrases */}
          <Card className="glass-panel hover:border-primary transition-all duration-300 slango-glow-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Flame className="text-purple-500 mr-2 w-5 h-5" />
                  Trending Phrases
                </h3>
                <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Explore
                </button>
              </div>

              <div className="space-y-3">
                {trendingPhrases.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg p-3 transition-colors cursor-pointer rounded-lg p-3 transition-colors glass-panel hover:border-primary transition-all duration-300 slango-glow-hover"
                  >
                    <span className="text-black-300 text-sm">
                      {item.phrase}
                    </span>
                    <span className="text-xs text-gray-500">{item.tag}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background/80 backdrop-blur glass-panel border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-4 slango-text">
              Powered by OpenAI • Translating the language barrier between
              generations
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <Link
                to="/legal#privacy"
                className="text-muted-foreground hover:text-primary transition-colors slango-glow-hover slango-text"
              >
                Privacy Policy
              </Link>
              <Link
                to="/legal#terms"
                className="text-muted-foreground hover:text-primary transition-colors slango-glow-hover slango-text"
              >
                Terms of Service
              </Link>
              <Link
                to="/legal#api"
                className="text-muted-foreground hover:text-primary transition-colors slango-glow-hover slango-text"
              >
                API Documentation
              </Link>
              <button
                onClick={() => setShowContactModal(true)}
                className="text-muted-foreground hover:text-primary transition-colors slango-glow-hover slango-text"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Saved Translations Modal */}
      <SavedTranslationsModal
        isOpen={showSavedTranslations}
        onClose={() => setShowSavedTranslations(false)}
        onLoadTranslation={handleLoadTranslation}
      />

      {/* History Translations Modal */}
      <HistoryTranslationsModal
        isOpen={showHistoryTranslations}
        onClose={() => setShowHistoryTranslations(false)}
        onLoadTranslation={handleLoadTranslation}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
}
function getPlaceholderText(languageCode: string): string {
  const languageNames: Record<string, string> = {
    standard_english: 'Standard English',
    formal_english: 'Formal English',
    gen_z_english: 'Gen Z English',
    millennial_english: 'Millennial English',
    british_english: 'British English',
    spanish: 'Spanish',
    french: 'French',
    aave: 'AAVE',
  };

  const languageName = languageNames[languageCode] || 'Text';
  return `Enter ${languageName} here...`;
}

interface VoiceButtonProps {
    text: string;
    languageCode: string;
    isPlaying: boolean;
    onPlay: () => void;
    disabled?: boolean;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ text, languageCode, isPlaying, onPlay, disabled }) => {
    const { toast } = useToast();

    const handlePlay = () => {
        if (!text.trim()) {
            toast({
                title: "Nothing to Speak",
                description: "Please enter some text first.",
                variant: "destructive",
            });
            return;
        }

        onPlay();
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary transition-colors duration-300 slango-glow-hover"
            onClick={handlePlay}
            disabled={disabled}
        >
            {isPlaying ? <VolumeX className="w-4 h-4 mr-1" /> : <Volume2 className="w-4 h-4 mr-1" />}
            Speak
        </Button>
    );
};