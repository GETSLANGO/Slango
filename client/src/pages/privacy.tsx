import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="slango-text min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="glass-panel border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <button className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium slango-text">Back to Slango</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="glass-panel shadow-xl">
          <CardContent className="p-6 sm:p-8 lg:p-12">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 slango-text">Privacy Policy</h1>
              
              <div className="text-sm text-muted-foreground mb-8 space-y-1">
                <p><strong>Effective Date:</strong> August 9, 2025</p>
                <p><strong>Last Updated:</strong> August 9, 2025</p>
              </div>

              <div className="space-y-6 text-foreground leading-relaxed slango-text">
                <p>
                  Slango ("we," "our," or "us") values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website, mobile version, and API services.
                </p>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
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
                  <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
                  <p>We use your information to:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Provide translation and language services.</li>
                    <li>Improve features and user experience.</li>
                    <li>Prevent abuse and maintain security.</li>
                    <li>Comply with legal obligations.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Sharing</h2>
                  <p>
                    We share data only with trusted service providers (e.g., Clerk, OpenAI, ElevenLabs, hosting/CDN, analytics partners).<br />
                    We do not sell personal data.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Retention</h2>
                  <p>
                    We keep personal data only as long as needed for the purposes stated, unless a longer retention period is required by law.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
                  <p>
                    You may request access, correction, deletion, or portability of your data at any time by contacting{" "}
                    <a href="mailto:slango.team.ai@gmail.com" className="text-primary hover:text-primary/80 underline">
                      slango.team.ai@gmail.com
                    </a>.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies</h2>
                  <p>
                    We use cookies to remember preferences, analyze traffic, and improve services. You can disable cookies in your browser, though this may affect functionality.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">7. Children's Privacy</h2>
                  <p>
                    Our services are not intended for children under 13 (or 16 where applicable).
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">8. Security</h2>
                  <p>
                    We implement reasonable technical and organizational measures to protect your data, but no system is 100% secure.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
                  <p>
                    We may update this policy periodically. We will post changes on this page and update the "Last Updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, contact us at{" "}
                    <a href="mailto:slango.team.ai@gmail.com" className="text-primary hover:text-primary/80 underline">
                      slango.team.ai@gmail.com
                    </a>.
                  </p>
                </section>

                <div className="border-t border-border pt-6 mt-8">
                  <p className="text-sm text-muted-foreground">
                    Copyright © 2025 Slango. All rights reserved. All site code, design, audio, and visual elements are the intellectual property of Slango and may not be used, copied, or reproduced without explicit written permission.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}