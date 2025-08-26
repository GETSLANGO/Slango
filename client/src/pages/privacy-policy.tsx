import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Globe } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LoginButton } from "@/components/ui/login-button";
import { useEffect } from "react";

export default function PrivacyPolicy() {
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
                <Shield className="text-primary text-2xl" />
                <div>
                  <h1 className="text-xl font-bold text-foreground tracking-wide font-[Orbitron] slango-text">Privacy Policy</h1>
                  <p className="text-xs text-muted-foreground slango-text">SLANGO Data Protection</p>
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 mb-6 slango-glow">
            <Shield className="text-primary-foreground text-3xl" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4 font-[Orbitron] slango-text">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground font-[Exo_2] slango-text">
            How we protect and handle your data
          </p>
          <p className="text-sm text-muted-foreground mt-2 slango-text">
            Last updated: January 2025
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Our Commitment to Privacy</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-4">
              <p className="mb-4">
                At Slango, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, and protect your data when you use our translation service.
              </p>
              <p>
                We believe in transparency and want you to understand exactly what information we collect and how we use it 
                to provide you with the best possible translation experience.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-black dark:text-white mb-3 font-orbitron">Translation Data</h3>
                <p>
                  We collect the text you input for translation and the resulting translations to improve our service quality 
                  and provide translation history features.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-black dark:text-white mb-3 font-orbitron">Account Information</h3>
                <p>
                  When you create an account, we collect your email address and username to provide personalized features 
                  like saved translations and translation history.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-semibold text-black dark:text-white mb-3 font-orbitron">Usage Analytics</h3>
                <p>
                  We collect anonymous usage statistics to understand how our service is used and to identify areas 
                  for improvement, including popular translation pairs and feature usage.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-semibold text-black dark:text-white mb-3 font-orbitron">Technical Information</h3>
                <p>
                  We automatically collect certain technical information such as IP addresses, browser type, 
                  and device information to ensure our service works properly and securely.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Service Provision</h3>
                <p>
                  We use your data to provide translation services, maintain translation history, and improve the accuracy 
                  of our translations through machine learning.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Service Improvement</h3>
                <p>
                  We analyze usage patterns to enhance our translation algorithms, add new language support, 
                  and improve user experience.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Communication</h3>
                <p>
                  We may use your information to send you service updates, security notifications, 
                  and respond to your inquiries.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Data Security</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Encryption</h3>
                <p>
                  All data transmission between your device and our servers is encrypted using industry-standard 
                  TLS encryption protocols.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Access Controls</h3>
                <p>
                  We implement strict access controls to ensure only authorized personnel can access your data, 
                  and only when necessary for service provision.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Data Retention</h3>
                <p>
                  We retain your translation data only as long as necessary to provide our services and comply with legal requirements. 
                  You can request deletion of your data at any time.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">OpenAI API</h3>
                <p>
                  We use OpenAI's API for language translation services. Your input text is processed by OpenAI's servers 
                  in accordance with their privacy policy and data usage terms.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">ElevenLabs API</h3>
                <p>
                  We use ElevenLabs' API for voice synthesis services. Text sent for voice generation is processed 
                  according to their privacy policy and data handling practices.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Data Sharing</h3>
                <p>
                  We do not sell, trade, or share your personal information with third parties except as necessary 
                  to provide our services or comply with legal obligations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Access and Correction</h3>
                <p>
                  You have the right to access, correct, or update your personal information. 
                  You can view your translation history and manage your preferences in your account settings.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Data Deletion</h3>
                <p>
                  You can request deletion of your personal data at any time. We will honor such requests 
                  within 30 days, subject to legal and operational requirements.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Opt-Out</h3>
                <p>
                  You can opt out of certain data collection practices, though this may limit some features 
                  of our service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-6">
              <p className="mb-4">
                If you have any questions about this Privacy Policy or how we handle your data, 
                please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> slango.team.ai@gmail.com
</p>
                <p><strong>Address:</strong> Slango Privacy Team</p>
                <p className="text-sm text-gray-400">
                  We will respond to privacy-related inquiries within 48 hours.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card className="bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 slango-glow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground font-[Orbitron] slango-text">Policy Updates</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground slango-text space-y-6">
              <p className="mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices 
                or legal requirements. We will notify users of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a notice on our service interface</li>
              </ul>
              <p className="text-sm text-gray-400">
                Continued use of our service after policy updates constitutes acceptance of the revised terms.
              </p>
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