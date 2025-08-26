import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Languages,
  Brain,
  Volume2,
  Zap,
  Shield,
  Globe,
  Star,
  User,
  ArrowRight,
} from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.1)_0%,transparent_70%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
              <span 
                className="block font-[Orbitron] mb-2 animate-gradient-wave" 
                style={{ 
                  background: 'linear-gradient(-45deg, #20272C, #00BDFD, #20272C, #00BDFD)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Transform{' '}
              </span>
              <span 
                className="block font-[Orbitron] animate-gradient-wave" 
                style={{ 
                  background: 'linear-gradient(-45deg, #00BDFD, #20272C, #00BDFD, #20272C)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animationDelay: '1s'
                }}
              >
                Language Barriers
              </span>
              <span 
                className="block font-[Orbitron] mt-2 animate-gradient-wave" 
                style={{ 
                  background: 'linear-gradient(-45deg, #20272C, #00BDFD, #20272C, #00BDFD)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animationDelay: '2s'
                }}
              >
                Into
              </span>
              <span 
                className="block font-[Orbitron] animate-gradient-wave" 
                style={{ 
                  background: 'linear-gradient(-45deg, #00BDFD, #20272C, #00BDFD, #20272C)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animationDelay: '3s'
                }}
              >
                Cultural Connections
              </span>
            </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            The world's most intelligent translation platform that bridges generational gaps, cultural differences, and communication styles with AI-powered precision.
          </p>
          <Link to="/">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg mb-12">
              Start Translating Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Translations Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-cyan-400 mb-2">8+</div>
              <div className="text-sm text-muted-foreground">Language Variants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-cyan-400 mb-2">4.9/5</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Slango Section */}
      <section className="py-20 lg:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Why Choose Slango?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Advanced AI technology meets intuitive design to deliver the most accurate and culturally-aware translations available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardContent className="p-8">
                <Languages className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Multi-Language Translation</h3>
                <p className="text-muted-foreground">
                  Transform text between Standard English, Gen Z slang, British English, Spanish, French, and more with expert precision.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardContent className="p-8">
                <Brain className="h-12 w-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">AI-Powered Intelligence</h3>
                <p className="text-muted-foreground">
                  Powered by OpenAI's model for context-aware translations that understand cultural nuances and intent.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardContent className="p-8">
                <Volume2 className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Voice Synthesis</h3>
                <p className="text-muted-foreground">
                  Hear your translations with authentic pronunciation using ElevenLabs premium voice technology.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardContent className="p-8">
                <Zap className="h-12 w-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Instant Results</h3>
                <p className="text-muted-foreground">
                  Get translations in seconds with intelligent caching system that learns and improves over time.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your translations are protected with enterprise-grade security and optional user accounts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardContent className="p-8">
                <Globe className="h-12 w-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Global Accessibility</h3>
                <p className="text-muted-foreground">
                  Works seamlessly across all devices with responsive design and mobile-optimized interface.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3-Step Instructions */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Simple. Fast. Accurate.
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Get professional-quality translations in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-blue-400 mb-4">1</div>
              <h3 className="text-xl font-bold mb-4">Enter Your Text</h3>
              <p className="text-muted-foreground">
                Type or speak your text in any supported language or style. Our system handles everything from formal business writing to casual slang.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-cyan-400 mb-4">2</div>
              <h3 className="text-xl font-bold mb-4">Choose Target Style</h3>
              <p className="text-muted-foreground">
                Select from Gen Z slang, formal English, British variants, Spanish, French, and more. Each with authentic cultural context.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-blue-400 mb-4">3</div>
              <h3 className="text-xl font-bold mb-4">Get Results</h3>
              <p className="text-muted-foreground">
                Receive your translation with clear explanations and audio pronunciation. Save favorites for future use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Trusted by Professionals
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              See what content creators, educators, and communicators say about Slango.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "Slango has revolutionized how I communicate with younger audiences. The Gen Z translations are spot-on!"
                </p>
                <div className="flex items-center">
                  <User className="h-10 w-10 text-blue-400 mr-3" />
                  <div>
                    <div className="font-bold">Sarah Chen</div>
                    <div className="text-sm text-muted-foreground">Social Media Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "As someone who creates content for diverse audiences, this tool is invaluable. The voice feature is incredible."
                </p>
                <div className="flex items-center">
                  <User className="h-10 w-10 text-cyan-400 mr-3" />
                  <div>
                    <div className="font-bold">Marcus Johnson</div>
                    <div className="text-sm text-muted-foreground">Content Creator</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "Perfect for teaching students about different communication styles. The explanations are clear and helpful."
                </p>
                <div className="flex items-center">
                  <User className="h-10 w-10 text-blue-400 mr-3" />
                  <div>
                    <div className="font-bold">Elena Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Language Teacher</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Break Down Language Barriers?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Join thousands of users who trust Slango for accurate, culturally-aware translations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Start Free Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/landing">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-border">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}