
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, History, Clock, Languages, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { LoginButton } from "@/components/ui/login-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

// Mock translation history data
const mockTranslationHistory = [
  {
    id: 1,
    originalText: "That's fire, no cap!",
    translatedText: "That's excellent, I'm being completely honest!",
    fromLanguage: "Gen Z English",
    toLanguage: "Standard English",
    date: "2025-01-23T14:30:00Z"
  },
  {
    id: 2,
    originalText: "I need to bounce, catch you later",
    translatedText: "Je dois partir, on se voit plus tard",
    fromLanguage: "Standard English",
    toLanguage: "French",
    date: "2025-01-23T13:15:00Z"
  },
  {
    id: 3,
    originalText: "This slaps different",
    translatedText: "This is exceptionally good in a unique way",
    fromLanguage: "Gen Z English",
    toLanguage: "Formal English",
    date: "2025-01-23T12:45:00Z"
  },
  {
    id: 4,
    originalText: "Bloody brilliant mate!",
    translatedText: "Absolutely excellent, friend!",
    fromLanguage: "British English",
    toLanguage: "Standard English",
    date: "2025-01-23T11:20:00Z"
  },
  {
    id: 5,
    originalText: "It's giving main character energy",
    translatedText: "Cela dégage une énergie de personnage principal",
    fromLanguage: "Gen Z English",
    toLanguage: "French",
    date: "2025-01-23T10:10:00Z"
  },
  {
    id: 6,
    originalText: "I'm absolutely chuffed to bits",
    translatedText: "I'm extremely pleased and delighted",
    fromLanguage: "British English",
    toLanguage: "Standard English",
    date: "2025-01-22T16:30:00Z"
  },
  {
    id: 7,
    originalText: "That's sus, not gonna lie",
    translatedText: "That appears suspicious, I must admit",
    fromLanguage: "Gen Z English",
    toLanguage: "Formal English",
    date: "2025-01-22T15:45:00Z"
  },
  {
    id: 8,
    originalText: "Estoy flipando con esto",
    translatedText: "I'm totally amazed by this",
    fromLanguage: "Spanish",
    toLanguage: "Standard English",
    date: "2025-01-22T14:20:00Z"
  },
  {
    id: 9,
    originalText: "This is absolutely mental!",
    translatedText: "This is completely crazy!",
    fromLanguage: "British English",
    toLanguage: "Standard English",
    date: "2025-01-22T13:15:00Z"
  },
  {
    id: 10,
    originalText: "It's giving 90s vibes fr fr",
    translatedText: "It genuinely evokes 1990s aesthetic and cultural elements",
    fromLanguage: "Gen Z English",
    toLanguage: "Formal English",
    date: "2025-01-22T12:00:00Z"
  }
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInHours < 48) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

export default function HistoryPage() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [historyData, setHistoryData] = useState(mockTranslationHistory);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    // In the future, this would fetch real data from the API
    // For now, we'll use the mock data
    if (isAuthenticated) {
      setHistoryData(mockTranslationHistory);
    }
  }, [isAuthenticated]);

  

  // Show login required message for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground font-[Exo_2]">
        {/* Header */}
        <header className="glass-panel border-b border-border shadow-lg backdrop-blur-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground slango-glow-hover transition-all duration-300">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Translator
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <LoginButton />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-foreground font-[Orbitron] slango-text">
                <History className="w-6 h-6 mr-2 text-primary" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-lg text-muted-foreground mb-6 slango-text">
                Please sign in to view your translation history
              </p>
              <LoginButton />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-[Exo_2]">
      {/* Header */}
      <header className="glass-panel border-b border-border shadow-lg backdrop-blur-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground slango-glow-hover transition-all duration-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Translator
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 font-[Orbitron] slango-text">Translation History</h1>
          <p className="text-muted-foreground slango-text">
            View all your past translations in one place
          </p>
        </div>

        {historyData.length === 0 ? (
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground font-[Orbitron] slango-text">
                <History className="w-5 h-5 mr-2 text-primary" />
                No History Yet
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <History className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground mb-2 slango-text">
                You haven't made any translations yet
              </p>
              <p className="text-sm text-muted-foreground/80 slango-text">
                Start translating to see your history here!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4 slango-text">
              {historyData.length} translation{historyData.length === 1 ? '' : 's'} found
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {historyData.map((translation) => (
                <Card key={translation.id} className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="slango-text">{formatDate(translation.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Languages className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground slango-text">{translation.fromLanguage}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground slango-text">{translation.toLanguage}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 slango-text">Original</h3>
                        <p className="text-foreground bg-muted/20 rounded-lg p-3 slango-text">
                          "{translation.originalText}"
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 slango-text">Translation</h3>
                        <p className="text-foreground bg-primary/10 rounded-lg p-3 slango-text">
                          "{translation.translatedText}"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button className="slango-primary slango-glow-hover transition-all duration-300 font-[Orbitron] slango-text">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to SLANGO
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
