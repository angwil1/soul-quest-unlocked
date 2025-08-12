import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Share2, CreditCard } from "lucide-react";
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
            <div>
              <p className="text-sm text-muted-foreground">
                © 2025 AI Complete Me. All rights reserved.
              </p>
              
              {/* Payment Methods */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs text-muted-foreground mr-2">We accept:</span>
                
                {/* PayPal */}
                <div className="flex items-center gap-1 px-2 py-1 bg-background border border-border rounded text-xs font-medium">
                  <svg className="w-4 h-4" fill="#0070ba" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81.42.48.73 1.01.892 1.582.344.14.662.32.942.525z"/>
                  </svg>
                  <span>PayPal</span>
                </div>
                
                {/* Visa */}
                <div className="flex items-center gap-1 px-2 py-1 bg-background border border-border rounded text-xs font-medium">
                  <svg className="w-4 h-4" fill="#1a1f71" viewBox="0 0 24 24">
                    <path d="M9.112 8.262L7.03 15.748H5.227L4.18 10.815c-.063-.246-.118-.337-.31-.44-.314-.168-.833-.326-1.287-.423L1.718 8.262h1.97c.251 0 .477.167.534.458l.488 2.595L6.302 8.26h1.81zm6.415 0L14.7 15.748h-1.706l.826-7.486h1.697zm3.498 4.833c.007-1.967-2.725-2.075-2.705-2.952.006-.267.26-.551.817-.624.276-.036.739-.064 1.35.237l.241-1.122c-.328-.12-.75-.235-1.275-.235-1.347 0-2.295.717-2.304 1.744-.008.759.677 1.182 1.194 1.434.532.259.71.425.708.656-.004.354-.424.51-.817.516-.686.01-1.084-.185-1.402-.333l-.247 1.155c.318.146.907.273 1.518.279 1.432 0 2.37-.708 2.372-1.805zm4.318 2.653h1.415L23.11 8.262h-1.31c-.287 0-.53.166-.638.421L18.83 15.748h1.432l.284-.786h1.75l.165.786zm-1.52-1.873l.719-1.984.413 1.984h-1.132z"/>
                  </svg>
                  <span>Visa</span>
                </div>
                
                {/* Mastercard */}
                <div className="flex items-center gap-1 px-2 py-1 bg-background border border-border rounded text-xs font-medium">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <circle cx="7" cy="12" r="7" fill="#eb001b"/>
                    <circle cx="17" cy="12" r="7" fill="#f79e1b"/>
                    <path d="M12 5.5a6.5 6.5 0 0 0 0 13c1.46 0 2.82-.48 3.91-1.29A6.97 6.97 0 0 1 12 12c0-1.96.8-3.73 2.09-5.00A6.48 6.48 0 0 0 12 5.5z" fill="#ff5f00"/>
                  </svg>
                  <span>Mastercard</span>
                </div>
              </div>
            </div>
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