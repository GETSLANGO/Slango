import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Code } from "lucide-react";

export default function ApiDocsPage() {
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
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 slango-text flex items-center gap-3">
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
                  <h2 className="text-xl font-semibold text-foreground mb-3">1. Authentication</h2>
                  <p>
                    All requests require a Bearer token in the Authorization header.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">2. Endpoints</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-mono text-primary mb-2">POST /v1/translate</h3>
                      <p className="text-sm mb-2"><strong>Description:</strong> Translate text from one language/slang style to another.</p>
                      <p className="text-sm mb-2"><strong>Body:</strong></p>
                      <pre className="bg-background p-3 rounded text-xs overflow-x-auto border">
<code>{`{ "from": "en", "to": "genz", "text": "string" }`}</code>
                      </pre>
                      <p className="text-sm mb-2"><strong>Response:</strong></p>
                      <pre className="bg-background p-3 rounded text-xs overflow-x-auto border">
<code>{`{ "translation": "string" }`}</code>
                      </pre>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-mono text-primary mb-2">POST /v1/tts</h3>
                      <p className="text-sm mb-2"><strong>Description:</strong> Convert text to speech using ElevenLabs voices.</p>
                      <p className="text-sm mb-2"><strong>Body:</strong></p>
                      <pre className="bg-background p-3 rounded text-xs overflow-x-auto border">
<code>{`{ "text": "string", "voice": "voice_name" }`}</code>
                      </pre>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-mono text-primary mb-2">GET /v1/history</h3>
                      <p className="text-sm"><strong>Description:</strong> Retrieve translation history for the authenticated user.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">3. Rate Limits</h2>
                  <p>
                    60 requests per minute.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">4. Usage Restrictions</h2>
                  <p>
                    No adult, hateful, or abusive content. No scraping or automated bulk requests. No redistribution of outputs without permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">5. Branding Rules</h2>
                  <p>
                    Include "Powered by Slango API" in any public-facing integration. Do not use the Slango logo or name without approval.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">6. Example Request (JavaScript)</h2>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="bg-background p-4 rounded text-sm overflow-x-auto border">
<code>{`fetch('https://api.getslango.com/v1/translate', {
  method: 'POST',
  headers: { 
    'Authorization': 'Bearer YOUR_TOKEN', 
    'Content-Type': 'application/json' 
  },
  body: JSON.stringify({ 
    from: 'en', 
    to: 'genz', 
    text: 'Hello world' 
  })
})`}</code>
                    </pre>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact</h2>
                  <p>
                    For API support, email{" "}
                    <a href="mailto:slango.team.ai@gmail.com" className="text-primary hover:text-primary/80 underline">
                      slango.team.ai@gmail.com
                    </a>.
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