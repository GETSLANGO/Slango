
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bookmark } from "lucide-react";
import { Link, useLocation } from "wouter";
import { LoginButton } from "@/components/ui/login-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useEffect } from "react";

export default function SavedTranslationsPage() {
  const [location] = useLocation();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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
              <div className="flex items-center space-x-4">
                <Bookmark className="text-primary text-2xl" />
                <div>
                  <h1 className="text-xl font-bold text-foreground tracking-wide font-[Orbitron] slango-text">Saved Translations</h1>
                  <p className="text-xs text-muted-foreground slango-text">Your Collection</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 font-[Orbitron] slango-text">Saved Translations</h1>
          <p className="text-muted-foreground slango-text">
            Manage your collection of saved translations
          </p>
        </div>

        <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground font-[Orbitron] slango-text">
              <Bookmark className="w-5 h-5 mr-2 text-primary" />
              Your Saved Translations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground mb-2 slango-text">
              Your saved translations will show here (soon!)
            </p>
            <p className="text-sm text-muted-foreground/80 slango-text">
              We're working on bringing you a dedicated page for managing your saved translations.
            </p>
          </CardContent>
        </Card>

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
