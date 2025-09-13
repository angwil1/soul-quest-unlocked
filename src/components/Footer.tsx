import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Share2, CreditCard, Linkedin, MessageCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BETA_CONFIG } from "@/config/betaConfig";

export const Footer = () => {
  const { toast } = useToast();
  
  const shareWebpage = (platform: string) => {
    const currentUrl = window.location.href;
    const shareText = "Check out AI Complete Me - Revolutionary dating with emotional intelligence! Find your soulmate through AI-powered deep compatibility matching. 💕";
    const shareTitle = "AI Complete Me - Find Your Perfect Match";
    
    switch (platform) {
      case "tiktok":
        navigator.clipboard.writeText(`${shareText} ${currentUrl}`);
        toast({
          title: "Link copied!",
          description: "Paste this in your TikTok video description or comments",
        });
        break;
      case "instagram":
        navigator.clipboard.writeText(`${shareText} ${currentUrl}`);
        toast({
          title: "Link copied!",
          description: "Paste this in your Instagram story or bio",
        });
        break;
      case "twitter":
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}&hashtags=dating,AI,soulmate,relationships`;
        window.open(twitterUrl, '_blank');
        break;
      case "facebook":
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`;
        window.open(facebookUrl, '_blank');
        break;
      case "linkedin":
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        window.open(linkedinUrl, '_blank');
        break;
      case "whatsapp":
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;
        window.open(whatsappUrl, '_blank');
        break;
      case "copy":
        navigator.clipboard.writeText(`${shareText} ${currentUrl}`);
        toast({
          title: "Link copied to clipboard!",
          description: "Share anywhere you'd like",
        });
        break;
    }
  };
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">AI Complete Me</h3>
            <p className="text-foreground/80 text-sm leading-relaxed">
              Dating with depth, powered by trust. Because real connection isn't rare—it's just waiting for the right space.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              
              <li><Link to="/pricing" className="text-foreground/70 hover:text-primary">Pricing</Link></li>
              <li><Link to="/ai-digest" className="text-foreground/70 hover:text-primary">AI Digest</Link></li>
              <li><Link to="/faq" className="text-foreground/70 hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-foreground/70 hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-foreground/70 hover:text-primary">Cookie Statement</Link></li>
              <li><Link to="/accessibility" className="text-foreground/70 hover:text-primary">Accessibility Statement</Link></li>
              <li><Link to="/safety" className="text-foreground/70 hover:text-primary">Safety Center</Link></li>
              <li><Link to="/terms" className="text-foreground/70 hover:text-primary">Terms of Service</Link></li>
              <li><a href="mailto:support@aicompleteme.com" className="text-foreground/70 hover:text-primary">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-foreground/70">
                © {BETA_CONFIG.copyrightYear} {BETA_CONFIG.businessName}. All rights reserved.
              </p>
              {BETA_CONFIG.isTestBuild && (
                <p className="text-xs text-orange-600 font-medium mt-1">
                  BETA VERSION {BETA_CONFIG.getBuildId()} - For Testing Only - Confidential & Proprietary
                </p>
              )}
              
              {/* Payment Methods */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs text-foreground/70 mr-2">We accept:</span>
                
                {/* PayPal */}
                <div className="flex items-center gap-1 px-2 py-1 bg-background border border-border rounded text-xs font-medium">
                  <svg className="w-4 h-4" fill="#0070ba" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81.42.48.73 1.01.892 1.582.344.14.662.32.942.525z"/>
                  </svg>
                  <span>PayPal</span>
                </div>
                
                {/* Apple Pay */}
                <div className="flex items-center gap-1 px-2 py-1 bg-background border border-border rounded text-xs font-medium">
                  <svg className="w-4 h-4" fill="#000000" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>Apple Pay</span>
                </div>
                
                {/* Google Pay */}
                <div className="flex items-center gap-1 px-2 py-1 bg-background border border-border rounded text-xs font-medium">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google Pay</span>
                </div>
                
                {/* Credit Cards (via PayPal) */}
                <div className="flex items-center gap-1 px-2 py-1 bg-background border border-border rounded text-xs font-medium">
                  <CreditCard className="w-4 h-4" />
                  <span>Cards via PayPal</span>
                </div>
                
                <div className="text-xs text-muted-foreground ml-2">
                  • Secure checkout • Mobile optimized
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              
              {/* Share This Page */}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-foreground/70 mb-3 font-medium">Share AI Complete Me:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareWebpage('copy')}
                    className="text-xs bg-primary/5 border-primary/20 hover:bg-primary/10"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Link
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareWebpage('whatsapp')}
                    className="text-xs hover:bg-green-50 hover:border-green-200"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    WhatsApp
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareWebpage('twitter')}
                    className="text-xs hover:bg-blue-50 hover:border-blue-200"
                  >
                    <Twitter className="w-4 h-4 mr-1" />
                    Twitter
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareWebpage('facebook')}
                    className="text-xs hover:bg-blue-50 hover:border-blue-200"
                  >
                    <Facebook className="w-4 h-4 mr-1" />
                    Facebook
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareWebpage('linkedin')}
                    className="text-xs hover:bg-blue-50 hover:border-blue-200"
                  >
                    <Linkedin className="w-4 h-4 mr-1" />
                    LinkedIn
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareWebpage('instagram')}
                    className="text-xs hover:bg-purple-50 hover:border-purple-200"
                  >
                    <Instagram className="w-4 h-4 mr-1" />
                    Instagram
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareWebpage('tiktok')}
                    className="text-xs hover:bg-gray-50 hover:border-gray-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.969-1.166-2.18-1.166-3.338h-3.154v13.729c0 2.051-1.668 3.719-3.719 3.719s-3.719-1.668-3.719-3.719 1.668-3.719 3.719-3.719c.394 0 .774.062 1.133.175V7.515a6.881 6.881 0 0 0-1.133-.094c-3.773 0-6.834 3.061-6.834 6.834s3.061 6.834 6.834 6.834 6.834-3.061 6.834-6.834V9.725a9.345 9.345 0 0 0 5.44 1.748V8.318a6.248 6.248 0 0 1-2.655-2.756z"/>
                    </svg>
                    TikTok
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