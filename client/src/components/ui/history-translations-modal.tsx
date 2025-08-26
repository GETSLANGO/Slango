import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Clock, ArrowRight, Loader2 } from "lucide-react";

interface Translation {
  id: number;
  inputText: string;
  outputText: string;
  sourceLanguage: string;
  targetLanguage: string;
  createdAt: string;
}

interface HistoryTranslationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTranslation?: (inputText: string, outputText: string, sourceLanguage: string, targetLanguage: string) => void;
}

export function HistoryTranslationsModal({ isOpen, onClose, onLoadTranslation }: HistoryTranslationsModalProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  const { data: translations, isLoading } = useQuery<Translation[]>({
    queryKey: ["/api/translations/history"],
    queryFn: async () => {
      // Get auth token
      let token = null;
      if (isSignedIn && typeof window !== 'undefined') {
        const clerk = (window as any).__clerk || (window as any).Clerk;
        if (clerk && clerk.session) {
          token = await clerk.session.getToken();
        }
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/translations/history", {
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          return [];
        }
        throw new Error('Failed to fetch history');
      }

      return response.json();
    },
    enabled: isOpen && isSignedIn,
    staleTime: 0,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isLoaded) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Translation History
          </DialogTitle>
        </DialogHeader>

        <SignedOut>
          <div className="text-center p-8">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Please sign in to view your history</h3>
            <p className="text-gray-600 mb-4">
              Sign in to access your saved translation history and sync across devices.
            </p>
            <SignInButton mode="modal">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <ScrollArea className="h-[500px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading your history...
              </div>
            ) : translations && translations.length > 0 ? (
              <div className="space-y-4">
                {translations.map((translation) => (
                  <Card key={translation.id} className="p-4">
                    <CardContent className="p-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {translation.sourceLanguage.replace("_", " ")}
                          </Badge>
                          <ArrowRight className="w-3 h-3 mt-1" />
                          <Badge variant="outline" className="text-xs">
                            {translation.targetLanguage.replace("_", " ")}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(translation.createdAt)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Original:</p>
                          <p className="text-sm text-gray-700">{translation.inputText}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Translation:</p>
                          <p className="text-sm text-gray-700">{translation.outputText}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No translation history yet</h3>
                <p className="text-gray-600">
                  Your translation history will appear here once you start translating.
                </p>
              </div>
            )}
          </ScrollArea>
        </SignedIn>
      </DialogContent>
    </Dialog>
  );
}