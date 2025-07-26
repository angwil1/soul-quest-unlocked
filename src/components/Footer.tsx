import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">GetUnlocked</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Dating with depth, powered by trust. Because real connection isn't rare, it's just waiting for the right space.
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
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><a href="mailto:support@getunlockedapp.com" className="text-muted-foreground hover:text-primary">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 GetUnlocked. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};