import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trash2,
  Copy,
  Calendar,
  ArrowRight,
  Volume2,
  BookOpen,
} from "lucide-react";
import { LANGUAGE_OPTIONS } from "@/components/ui/language-selector";

interface SavedTranslation {
  id: number;
  inputText: string;
  outputText: string;
  sourceLanguage: string;
  targetLanguage: string;
  createdAt: string;
}

interface SavedTranslationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTranslation?: (inputText: string, outputText: string, sourceLanguage: string, targetLanguage: string) => void;
}

export function SavedTranslationsModal({ 
  isOpen, 
  onClose, 
  onLoadTranslation 
}: SavedTranslationsModalProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch saved translations
  const { data: savedTranslations = [], isLoading } = useQuery<SavedTranslation[]>({
    queryKey: ["/api/translations/saved"],
    enabled: isSignedIn && isOpen,
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale
  });

  // Delete translation mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/translations/saved/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations/saved"] });
      toast({
        title: "Deleted",
        description: "Translation removed from saved list.",
      });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please Sign In",
          description: "You need to be signed in to delete translations.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete translation.",
        variant: "destructive",
      });
    },
  });

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

  const handleLoad = (translation: SavedTranslation) => {
    if (onLoadTranslation) {
      onLoadTranslation(
        translation.inputText,
        translation.outputText,
        translation.sourceLanguage,
        translation.targetLanguage
      );
      onClose();
      toast({
        title: "Translation Loaded",
        description: "Translation has been loaded into the main interface.",
      });
    }
  };

  const getLanguageName = (code: string) => {
    return LANGUAGE_OPTIONS.find(opt => opt.code === code)?.name || code;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (!isLoaded) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Saved Translations
          </DialogTitle>
        </DialogHeader>

        <SignedOut>
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please sign in to view your saved translations.
            </p>
            <SignInButton mode="modal">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <ScrollArea className="max-h-[60vh] pr-4">
            {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : savedTranslations.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">No saved translations yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                Click the bookmark icon next to any translation to save it
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedTranslations.map((translation) => (
                <Card key={translation.id} className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {formatDate(translation.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleLoad(translation)}
                          className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-200 dark:hover:bg-gray-600 h-8 px-2"
                          title="Load into translator"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(translation.id)}
                          disabled={deleteMutation.isPending}
                          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-gray-200 dark:hover:bg-gray-600 h-8 px-2"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Language Direction */}
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">
                          {getLanguageName(translation.sourceLanguage)}
                        </span>
                        <ArrowRight className="w-3 h-3" />
                        <span className="font-medium">
                          {getLanguageName(translation.targetLanguage)}
                        </span>
                      </div>

                      {/* Translation Content */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Input ({getLanguageName(translation.sourceLanguage)})
                          </div>
                          <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-3 text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                            {translation.inputText}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopy(translation.inputText)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 h-7 px-2 w-fit"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Output ({getLanguageName(translation.targetLanguage)})
                          </div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                            {translation.outputText}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(translation.outputText)}
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 h-7 px-2"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 h-7 px-2"
                            >
                              <Volume2 className="w-3 h-3 mr-1" />
                              Play
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </ScrollArea>
        </SignedIn>

        <div className="flex justify-end pt-4 border-t border-gray-300 dark:border-gray-700">
          <Button
            onClick={onClose}
            variant="outline"
            className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 bg-transparent font-medium px-6 py-2"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}