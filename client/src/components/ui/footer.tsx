export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background/80 backdrop-blur glass-panel">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center space-y-3">
          {/* Copyright Notice */}
          <div className="text-sm text-foreground font-medium slango-text">
            © 2025 Slango. All rights reserved.
          </div>
          
          {/* Intellectual Property Notice */}
          <div className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed slango-text">
            All content, code, audio, and visual design elements are the intellectual property of Slango and may not be used, copied, or reproduced without explicit written permission.
          </div>
          
          {/* API Credits */}
          <div className="text-xs text-muted-foreground space-y-1 slango-text">
            <div>Custom voice synthesis provided by ElevenLabs API.</div>
            <div>Language generation powered by OpenAI GPT API.</div>
            <div>Design styling built with Tailwind CSS.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}