import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoginButton } from "@/components/ui/login-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Languages, 
  Zap, 
  Globe, 
  Users, 
  Shield, 
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  Brain,
  Volume2,
  Menu,
  X
} from "lucide-react";

export default function Landing() {
  const [location] = useLocation();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Scroll to top when navigated to this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const features = [
    {
      icon: <Languages className="w-8 h-8" />,
      title: "Multi-Language Translation",
      description: "Transform text between Standard English, Gen Z slang, British English, Spanish, French, and more with expert precision."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Intelligence",
      description: "Powered by OpenAI's model for context-aware translations that understand cultural nuances and intent."
    },
    {
      icon: <Volume2 className="w-8 h-8" />,
      title: "Voice Synthesis",
      description: "Hear your translations with authentic pronunciation using ElevenLabs' premium voice technology."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Results",
      description: "Get translations in seconds with intelligent caching system that learns and improves over time."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your translations are protected with enterprise-grade security and optional user accounts."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Accessibility",
      description: "Works seamlessly across all devices with responsive design and mobile-optimized interface."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Social Media Manager",
      content: "Slango has revolutionized how I communicate with younger audiences. The Gen Z translations are spot-on!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Content Creator",
      content: "As someone who creates content for diverse audiences, this tool is invaluable. The voice feature is incredible.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Language Teacher",
      content: "Perfect for teaching students about different communication styles. The explanations are clear and helpful.",
      rating: 5
    }
  ];

  const stats = [
    { number: "50K+", label: "Translations Processed" },
    { number: "8+", label: "Language Variants" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <Languages className="text-primary slango-glow text-2xl" />
            </div>
            <span className="text-2xl slango-brand">
              SLANGO
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </Link>
            <Link href="/privacy-policy?from=landing" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/about" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground text-xs md:text-sm">
              <Users className="w-4 h-4" />
              <span>About Us</span>
            </Link>
            <LoginButton />
            <Link href="/">
              <Button>
                Try Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Mobile Right Section */}
          <div className="flex md:hidden items-center space-x-3">
            <ThemeToggle />
            <Link href="/about" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground text-xs md:text-sm">
              <Users className="w-4 h-4" />
              <span>About Us</span>
            </Link>
            <LoginButton />

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-6 mt-8">
                  <Link 
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full" size="lg">
                      Try Free <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  <div className="flex flex-col space-y-4">
                    <Link 
                      href="/about" 
                      className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link 
                      href="#testimonials" 
                      className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Reviews
                    </Link>
                    <Link 
                      href="/privacy-policy?from=landing" 
                      className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Privacy
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">


            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              Transform Language Barriers Into
              <span className="block text-primary">Cultural Connections</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              The world's most intelligent translation platform that bridges generational gaps, 
              cultural differences, and communication styles with AI-powered precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                  Start Translating Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>


            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose Slango?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets intuitive design to deliver the most accurate 
              and culturally-aware translations available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Simple. Fast. Accurate.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get professional-quality translations in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Enter Your Text</h3>
              <p className="text-muted-foreground">
                Type or speak your text in any supported language or style. Our system handles everything from formal business writing to casual slang.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Choose Target Style</h3>
              <p className="text-muted-foreground">
                Select from Gen Z slang, formal English, British variants, Spanish, French, and more. Each with authentic cultural context.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Results</h3>
              <p className="text-muted-foreground">
                Receive your translation with clear explanations and optional voice pronunciation. Save favorites for future use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what content creators, educators, and communicators say about Slango.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Break Down Language Barriers?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who trust Slango for accurate, culturally-aware translations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                  Start Free Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/privacy-policy?from=landing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free Forever Plan</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}