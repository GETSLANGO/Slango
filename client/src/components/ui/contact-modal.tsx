import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when modal opens
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const result = await response.json();

      toast({
        title: "Message sent successfully!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Reset form and close modal
      setFormData({ name: "", email: "", subject: "", message: "" });
      onClose();
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly at slango.team.ai@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card dark:bg-card text-card-foreground border-border glass-panel backdrop-blur-16 p-0 max-h-[calc(100dvh-24px)] md:max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-0 shrink-0">
          <DialogTitle className="text-2xl font-bold text-foreground font-[Orbitron] slango-text flex items-center">
            <MessageSquare className="w-6 h-6 mr-3 text-primary" />
            Contact SLANGO
          </DialogTitle>
        </DialogHeader>

        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin'
          }}
        >
          <div className="grid gap-6 py-4 pb-24">
            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 glass-panel">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Email</p>
                  <p className="text-muted-foreground text-xs">slango.team.ai@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 glass-panel">
                <MessageSquare className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Response Time</p>
                  <p className="text-muted-foreground text-xs">Within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 scroll-margin-bottom-[80px]">
                  <Label htmlFor="name" className="text-foreground font-[Exo_2]">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    className="glass-panel border-border bg-background/50 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2 scroll-margin-bottom-[80px]">
                  <Label htmlFor="email" className="text-foreground font-[Exo_2]">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    className="glass-panel border-border bg-background/50 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2 scroll-margin-bottom-[80px]">
                <Label htmlFor="subject" className="text-foreground font-[Exo_2]">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  required
                  className="glass-panel border-border bg-background/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2 scroll-margin-bottom-[80px]">
                <Label htmlFor="message" className="text-foreground font-[Exo_2]">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  required
                  rows={4}
                  className="glass-panel border-border bg-background/50 text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              {/* Alternative Contact Methods */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center font-[Exo_2]">
                  For urgent technical issues, you can also reach us directly at{" "}
                  <a 
                    href="mailto:slango.team.ai@gmail.com" 
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    slango.team.ai@gmail.com
                  </a>
                </p>
              </div>

              {/* Action Buttons - moved below alternative contact info */}
              <div className="mt-4 flex justify-end space-x-3 pb-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="slango-button-secondary"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="slango-primary slango-glow-hover transition-all duration-300 font-[Orbitron] slango-text"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}