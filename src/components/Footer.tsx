import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const Footer = () => {
  const { toast } = useToast();
  
  const shareWebpage = (platform: string) => {
    const currentUrl = window.location.href;
    
    switch (platform) {
      case "tiktok":
        navigator.clipboard.writeText(currentUrl);
        toast({
          title: "Link copied!",
          description: "Share this page on TikTok",
        });
        break;
      case "instagram":
        navigator.clipboard.writeText(currentUrl);
        toast({
          title: "Link copied!",
          description: "Share this page on Instagram",
        });
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`, '_blank');
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
        break;
    }
  };
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">AI Complete Me</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Dating with depth, powered by trust. Because real connection isn't rare—it's just waiting for the right space.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/questions" className="text-muted-foreground hover:text-primary">Compatibility Quiz</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
              <li><Link to="/ai-digest" className="text-muted-foreground hover:text-primary">AI Digest</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-muted-foreground hover:text-primary">Cookie Statement</Link></li>
              <li><Link to="/accessibility" className="text-muted-foreground hover:text-primary">Accessibility Statement</Link></li>
              <li><Link to="/safety" className="text-muted-foreground hover:text-primary">Safety Center</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><a href="mailto:support@getunlockedapp.com" className="text-muted-foreground hover:text-primary">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 AI Complete Me. All rights reserved.
            </p>
            <div className="flex flex-col gap-4">
              {/* Social Media Links */}
              <div className="flex items-center gap-4">
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.969-1.166-2.18-1.166-3.338h-3.154v13.729c0 2.051-1.668 3.719-3.719 3.719s-3.719-1.668-3.719-3.719 1.668-3.719 3.719-3.719c.394 0 .774.062 1.133.175V7.515a6.881 6.881 0 0 0-1.133-.094c-3.773 0-6.834 3.061-6.834 6.834s3.061 6.834 6.834 6.834 6.834-3.061 6.834-6.834V9.725a9.345 9.345 0 0 0 5.44 1.748V8.318a6.248 6.248 0 0 1-2.655-2.756z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook size={20} />
                </a>
              </div>
              
              {/* Share This Page */}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-3 font-medium">Share this page:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareWebpage('tiktok')}
                    className="text-xs"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.969-1.166-2.18-1.166-3.338h-3.154v13.729c0 2.051-1.668 3.719-3.719 3.719s-3.719-1.668-3.719-3.719 1.668-3.719 3.719-3.719c.394 0 .774.062 1.133.175V7.515a6.881 6.881 0 0 0-1.133-.094c-3.773 0-6.834 3.061-6.834 6.834s3.061 6.834 6.834 6.834 6.834-3.061 6.834-6.834V9.725a9.345 9.345 0 0 0 5.44 1.748V8.318a6.248 6.248 0 0 1-2.655-2.756z"/>
                    </svg>
                    TikTok
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareWebpage('instagram')}
                    className="text-xs"
                  >
                    <Instagram className="w-4 h-4 mr-1" />
                    Instagram
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareWebpage('twitter')}
                    className="text-xs"
                  >
                    <Twitter className="w-4 h-4 mr-1" />
                    Twitter
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareWebpage('facebook')}
                    className="text-xs"
                  >
                    <Facebook className="w-4 h-4 mr-1" />
                    Facebook
                  </Button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};