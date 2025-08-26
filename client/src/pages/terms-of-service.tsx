import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Scale, AlertTriangle, Users, Globe, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { LoginButton } from "@/components/ui/login-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useEffect } from "react";

export default function TermsOfService() {
  const [location] = useLocation();
  
  // Scroll to top when component mounts or route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  // Parse the 'from' parameter from the URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const fromPage = urlParams.get('from');
  
  // Determine return path based on 'from' parameter
  const returnPath = fromPage === 'app' ? '/' : '/landing';
  return (
    <div className="min-h-screen bg-background text-foreground font-[Exo_2]">
      {/* Header */}
      <header className="glass-panel border-b border-border shadow-lg backdrop-blur-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href={returnPath}>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground slango-glow-hover transition-all duration-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Translator
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <Scale className="text-primary text-2xl" />
                <div>
                  <h1 className="text-xl font-bold text-foreground tracking-wide font-[Orbitron] slango-text">Terms of Service</h1>
                  <p className="text-xs text-muted-foreground slango-text">SLANGO Usage Agreement</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-4 font-[Orbitron] slango-text">Terms of Service</h1>
          <p className="text-muted-foreground slango-text">
            Last updated: January 2025
          </p>
        </div>

        <div className="space-y-6">
          {/* Agreement */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground font-[Orbitron] slango-text">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text">
              <p className="mb-4">
                By accessing and using SLANGO, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms of Service ("Terms") govern your use of our translation service operated by SLANGO ("us", "we", or "our"). 
                Your access to and use of the service is conditioned on your acceptance of and compliance with these Terms.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground font-[Orbitron] slango-text">
                <Globe className="w-5 h-5 mr-2 text-primary" />
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Translation Services</h3>
                <p>
                  SLANGO provides automated translation services between multiple language styles and dialects, 
                  including but not limited to Standard English, Gen Z slang, Millennial slang, British English, 
                  Spanish, and French.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Voice Synthesis</h3>
                <p>
                  Our service includes text-to-speech functionality powered by ElevenLabs API, 
                  providing authentic pronunciation for translated content in multiple languages and dialects.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">AI-Powered Translation</h3>
                <p>
                  Translation accuracy and quality are powered by OpenAI's language models. 
                  While we strive for high accuracy, automated translations may not always be perfect.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground font-[Orbitron] slango-text">
                <Users className="w-5 h-5 mr-2 text-primary" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Appropriate Use</h3>
                <p>
                  You agree to use SLANGO only for lawful purposes and in accordance with these Terms. 
                  You may not use our service to translate content that is illegal, harmful, threatening, 
                  abusive, defamatory, or violates any applicable laws.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Content Responsibility</h3>
                <p>
                  You are solely responsible for any content you input into our translation service. 
                  We do not monitor, edit, or control the content you submit, and we are not responsible 
                  for any content or the accuracy of translations.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Account Security</h3>
                <p>
                  If you create an account with us, you are responsible for maintaining the security of your account 
                  and for all activities that occur under your account.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground font-[Orbitron] slango-text">
                <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
                Prohibited Uses
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-4">
              <p className="mb-4">You may not use our service:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>To translate content that violates any local, state, national, or international law</li>
                <li>To transmit hate speech, harassment, or discriminatory content</li>
                <li>To impersonate any person or entity or falsely state your affiliation</li>
                <li>To attempt to gain unauthorized access to our systems or networks</li>
                <li>To interfere with or disrupt our service or servers</li>
                <li>To use our service for any commercial purpose without explicit permission</li>
                <li>To scrape, crawl, or systematically extract data from our service</li>
              </ul>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground font-[Orbitron] slango-text">
                <Zap className="w-5 h-5 mr-2 text-primary" />
                Service Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Service Uptime</h3>
                <p>
                  We strive to provide reliable service but cannot guarantee 100% uptime. 
                  Our service may be temporarily unavailable due to maintenance, updates, or technical issues.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Rate Limits</h3>
                <p>
                  We may implement rate limiting to ensure fair usage and maintain service quality. 
                  Heavy usage may result in temporary restrictions.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Service Modifications</h3>
                <p>
                  We reserve the right to modify, suspend, or discontinue any aspect of our service 
                  at any time without prior notice.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Service Ownership</h3>
                <p>
                  The SLANGO service, including its original content, features, and functionality, 
                  is owned by SLANGO and is protected by international copyright, trademark, and other laws.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">User Content</h3>
                <p>
                  You retain ownership of any content you submit to our service. By using our service, 
                  you grant us a limited license to process and translate your content solely for the purpose 
                  of providing our translation services.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Third-Party Services</h3>
                <p>
                  Our service integrates with third-party APIs (OpenAI, ElevenLabs) that have their own 
                  terms of service and intellectual property rights.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Translation Accuracy</h3>
                <p>
                  While we strive for accuracy, automated translations may contain errors or inaccuracies. 
                  We do not guarantee the accuracy, completeness, or reliability of any translation.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Service "As Is"</h3>
                <p>
                  Our service is provided "as is" without warranties of any kind, either express or implied, 
                  including but not limited to merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Limitation of Liability</h3>
                <p>
                  In no event shall SLANGO be liable for any indirect, incidental, special, consequential, 
                  or punitive damages arising out of or related to your use of our service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Termination</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Account Termination</h3>
                <p>
                  We may terminate or suspend your account and access to our service immediately, 
                  without prior notice, for conduct that we believe violates these Terms.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 font-[Orbitron] slango-text">Effect of Termination</h3>
                <p>
                  Upon termination, your right to use our service will cease immediately. 
                  All provisions of these Terms that should survive termination shall survive.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text">
              <p className="mb-4">
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction 
                where SLANGO is operated, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising under these Terms shall be resolved through binding arbitration 
                in accordance with the rules of the American Arbitration Association.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text">
              <p className="mb-4">
                We reserve the right to modify these Terms at any time. If we make material changes, 
                we will notify users by:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Posting the updated terms on our website</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying prominent notices on our service</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Your continued use of our service after any modifications indicates your acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text">
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> slango.team.ai@gmail.com
</p>
                <p><strong>Address:</strong> SLANGO Legal Department</p>
                <p className="text-sm text-muted-foreground">
                  We will respond to legal inquiries within 5 business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href={returnPath}>
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