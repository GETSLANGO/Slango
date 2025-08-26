
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, UserCheck, Globe, Code, Server, Zap, Users, FileText, Scale, Gavel, AlertTriangle, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LegalPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => navigate('/'), 150); // Allow animation to complete
  };

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[900px] h-[calc(100dvh-24px)] max-h-[calc(100dvh-24px)] overflow-hidden bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 flex flex-col"
        hideCloseButton={true}
      >
        {/* Fixed Close Button - positioned relative to viewport */}
        <button
          onClick={handleClose}
          className="fixed top-4 right-4 z-[100] w-10 h-10 rounded-full bg-background/90 dark:bg-background/90 backdrop-blur-md border border-border shadow-lg hover:bg-background hover:shadow-xl transition-all duration-200 flex items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
          }}
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-foreground font-[Orbitron] slango-text flex items-center">
            <Scale className="w-6 h-6 mr-3 text-primary" />
            Legal Information
          </DialogTitle>
          
          {/* Navigation Menu */}
          <div className="flex items-center justify-center space-x-6 pt-4">
            <a href="#privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#api" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              API Documentation
            </a>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 pb-[calc(env(safe-area-inset-bottom)+16px)]" style={{WebkitOverflowScrolling: 'touch'}}>
        <div className="space-y-12">
          
          {/* Privacy Policy Section */}
          <section id="privacy" className="scroll-margin-bottom-[80px]">
            <Card className="glass-panel shadow-xl">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 slango-text flex items-center gap-3 scroll-margin-bottom-[80px]">
                    <Shield className="w-8 h-8 text-primary" />
                    Privacy Policy
                  </h1>
                  
                  <div className="text-sm text-muted-foreground mb-8 space-y-1">
                    <p><strong>Effective Date:</strong> August 9, 2025</p>
                    <p><strong>Last Updated:</strong> August 9, 2025</p>
                  </div>

                  <div className="space-y-6 text-foreground leading-relaxed slango-text">
                    <p>
                      Slango ("we," "our," or "us") values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website, mobile version, and API services.
                    </p>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        1. Information We Collect
                      </h2>
                      <p>We may collect:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-3">
                        <li>Account details provided through Clerk authentication (e.g., name, email).</li>
                        <li>Translation text inputs and outputs processed by our AI models (OpenAI API).</li>
                        <li>Optional audio inputs for voice synthesis (processed via ElevenLabs API).</li>
                        <li>Device, browser, and analytics data to improve performance.</li>
                        <li>Cookies and similar technologies to enhance your experience.</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-primary" />
                        2. How We Use Your Information
                      </h2>
                      <p>We use your information to:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-3">
                        <li>Provide translation and language services.</li>
                        <li>Improve features and user experience.</li>
                        <li>Prevent abuse and maintain security.</li>
                        <li>Comply with legal obligations.</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        3. Data Sharing
                      </h2>
                      <p>
                        We share data only with trusted service providers (e.g., Clerk, OpenAI, ElevenLabs, hosting/CDN, analytics partners).<br />
                        We do not sell personal data.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        4. Data Retention
                      </h2>
                      <p>
                        We keep personal data only as long as needed for the purposes stated, unless a longer retention period is required by law.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-primary" />
                        5. Your Rights
                      </h2>
                      <p>
                        You may request access, correction, deletion, or portability of your data at any time by contacting{" "}
                        <a href="mailto:slango.team.ai@gmail.com" className="text-primary hover:text-primary/80 underline">
                          slango.team.ai@gmail.com
                        </a>.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        6. Cookies
                      </h2>
                      <p>
                        We use cookies to remember preferences, analyze traffic, and improve services. You can disable cookies in your browser, though this may affect functionality.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        7. Children's Privacy
                      </h2>
                      <p>
                        Our services are not intended for children under 13 (or 16 where applicable).
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        8. Security
                      </h2>
                      <p>
                        We implement reasonable technical and organizational measures to protect your data, but no system is 100% secure.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        9. Changes to This Policy
                      </h2>
                      <p>
                        We may update this policy periodically. We will post changes on this page and update the "Last Updated" date.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-primary" />
                        10. Contact Us
                      </h2>
                      <p>
                        If you have any questions about this Privacy Policy, contact us at{" "}
                        <a href="mailto:slango.team.ai@gmail.com" className="text-primary hover:text-primary/80 underline">
                          slango.team.ai@gmail.com
                        </a>.
                      </p>
                    </section>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Terms of Service Section */}
          <section id="terms" className="scroll-margin-bottom-[80px]">
            <Card className="glass-panel shadow-xl">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 slango-text flex items-center gap-3 scroll-margin-bottom-[80px]">
                    <Scale className="w-8 h-8 text-primary" />
                    Terms of Service
                  </h1>
                  
                  <div className="text-sm text-muted-foreground mb-8 space-y-1">
                    <p><strong>Effective Date:</strong> August 9, 2025</p>
                    <p><strong>Last Updated:</strong> August 9, 2025</p>
                  </div>

                  <div className="space-y-6 text-foreground leading-relaxed slango-text">
                    <p>
                      Welcome to Slango. By accessing or using our website, mobile version, or API, you agree to these Terms of Service.
                    </p>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-primary" />
                        1. Acceptance
                      </h2>
                      <p>
                        By using Slango, you confirm you are at least 13 years old (or 16 where applicable) and have the legal capacity to enter into this agreement.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        2. License to Use
                      </h2>
                      <p>
                        We grant you a limited, revocable, non-transferable license to use Slango for personal or authorized business use.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        3. User Content
                      </h2>
                      <p>
                        You retain ownership of the content you submit, but grant Slango a worldwide, royalty-free license to process, display, and store it for service purposes.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-primary" />
                        4. Prohibited Uses
                      </h2>
                      <p>
                        You may not use Slango for illegal activity, harassment, scraping, reverse engineering, intellectual property infringement, or any unsafe/high-risk use.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        5. Intellectual Property
                      </h2>
                      <p>
                        Slango owns all rights, titles, and interests in the platform, branding, design, and code. Our trademarks and brand elements may not be used without permission.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        6. API and Output Terms
                      </h2>
                      <p>
                        Outputs may be AI-generated and could contain inaccuracies. You are solely responsible for how you use them.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-primary" />
                        7. Disclaimers & Limitation of Liability
                      </h2>
                      <p>
                        Slango is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-primary" />
                        8. Termination
                      </h2>
                      <p>
                        We may suspend or terminate your account at any time for violations of these terms.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Gavel className="w-5 h-5 text-primary" />
                        9. Governing Law
                      </h2>
                      <p>
                        These terms are governed by the laws of Delaware, USA. Disputes will be resolved via binding arbitration or small claims court.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        10. Changes to Terms
                      </h2>
                      <p>
                        We may update these terms. Changes will be posted here with the "Last Updated" date.
                      </p>
                    </section>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* API Documentation Section */}
          <section id="api" className="scroll-margin-bottom-[80px]">
            <Card className="glass-panel shadow-xl">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 slango-text flex items-center gap-3 scroll-margin-bottom-[80px]">
                    <Code className="w-8 h-8 text-primary" />
                    API Documentation
                  </h1>
                  
                  <div className="text-sm text-muted-foreground mb-8 space-y-1">
                    <p><strong>Effective Date:</strong> August 9, 2025</p>
                    <p><strong>Last Updated:</strong> August 9, 2025</p>
                  </div>

                  <div className="space-y-6 text-foreground leading-relaxed slango-text">
                    <p>
                      Welcome to the Slango API. This documentation covers authentication, endpoints, and usage rules.
                    </p>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        1. Overview
                      </h2>
                      <p>
                        The Slango API provides translation services between standard English and various slang styles including Gen Z, Millennial, British English, Formal English, Spanish, and French. Contact our team for API access.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        2. Technology Credits
                      </h2>
                      <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <p className="text-sm mb-3">
                          <strong>Slango is powered by:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li><strong>OpenAI GPT-4o:</strong> Advanced language understanding and generation</li>
                          <li><strong>ElevenLabs:</strong> High-quality neural voice synthesis</li>
                          <li><strong>Slango Engine:</strong> Proprietary slang detection and normalization</li>
                        </ul>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        3. Allowed Use
                      </h2>
                      <p>
                        Use Slango API for educational purposes, communication bridging, language learning, and legitimate business applications.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-primary" />
                        4. Prohibited Use
                      </h2>
                      <p>
                        No adult, hateful, or abusive content. No scraping, bulk automation, or redistribution of outputs without permission.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-primary" />
                        5. Contact
                      </h2>
                      <p>
                        For API access, technical support, or partnership inquiries, email{" "}
                        <a href="mailto:slango.team.ai@gmail.com" className="text-primary hover:text-primary/80 underline">
                          slango.team.ai@gmail.com
                        </a>.
                      </p>
                    </section>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Copyright Footer */}
          <div className="border-t border-border pt-8 mt-12">
            <p className="text-sm text-muted-foreground text-center">
              Copyright © 2025 Slango. All rights reserved. All site code, design, audio, and visual elements are the intellectual property of Slango and may not be used, copied, or reproduced without explicit written permission.
            </p>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
