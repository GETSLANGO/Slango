import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 slango-text">Terms of Service</h1>
              
              <div className="text-sm text-muted-foreground mb-8 space-y-1">
                <p><strong>Effective Date:</strong> August 9, 2025</p>
                <p><strong>Last Updated:</strong> August 9, 2025</p>
              </div>

              <div className="space-y-6 text-foreground leading-relaxed slango-text">
                <p>
                  Welcome to Slango. By accessing or using our website, mobile version, or API, you agree to these Terms of Service.
                </p>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance</h2>
                  <p>
                    By using Slango, you confirm you are at least 13 years old (or 16 where applicable) and have the legal capacity to enter into this agreement.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">2. License to Use</h2>
                  <p>
                    We grant you a limited, revocable, non-transferable license to use Slango for personal or authorized business use.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">3. User Content</h2>
                  <p>
                    You retain ownership of the content you submit, but grant Slango a worldwide, royalty-free license to process, display, and store it for service purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">4. Prohibited Uses</h2>
                  <p>
                    You may not use Slango for illegal activity, harassment, scraping, reverse engineering, intellectual property infringement, or any unsafe/high-risk use.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
                  <p>
                    Slango owns all rights, titles, and interests in the platform, branding, design, and code. Our trademarks and brand elements may not be used without permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">6. API and Output Terms</h2>
                  <p>
                    Outputs may be AI-generated and could contain inaccuracies. You are solely responsible for how you use them.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">7. Disclaimers & Limitation of Liability</h2>
                  <p>
                    Slango is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">8. Termination</h2>
                  <p>
                    We may suspend or terminate your account at any time for violations of these terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">9. Governing Law</h2>
                  <p>
                    These terms are governed by the laws of Delaware, USA. Disputes will be resolved via binding arbitration or small claims court.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to Terms</h2>
                  <p>
                    We may update these terms. Changes will be posted here with the "Last Updated" date.
                  </p>
                </section>

                <div className="border-t border-border pt-6 mt-8">
                  <p className="text-sm text-muted-foreground">
                    Copyright © 2025 Slango. All rights reserved.
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