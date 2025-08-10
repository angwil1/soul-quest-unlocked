import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubscription } from "@/hooks/useSubscription";
import SearchFilters from "@/components/SearchFilters";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { subscription } = useSubscription();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchPreference, setSearchPreference] = useState('');
  const [zipCode, setZipCode] = useState('');

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Quiz", href: "/questions" },
    { name: "Premium", href: "/premium-dashboard" },
    { name: "AI Digest", href: "/ai-digest" },
    { name: "Connection DNA", href: "/connection-dna" },
    { name: "Memory Vault", href: "/memory-vault" },
    { name: "Upgrade", href: "/pricing" },
    { name: "Safety", href: "/safety" },
    { name: "FAQ", href: "/faq" },
  ];

  const echoNavigation = [
    { name: "Sample Profiles", href: "/sample-profiles" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Check if user has Echo Amplified (premium tier)
  const isEchoActive = subscription?.subscribed && subscription?.subscription_tier === 'Pro';

  const handleFiltersChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const handlePreferenceChange = (preference: string) => {
    setSearchPreference(preference);
  };

  const handleZipCodeChange = (zip: string) => {
    setZipCode(zip);
  };

  const handleSearch = () => {
    setShowSearchModal(false);
    if (searchQuery.trim()) {
      navigate(`/matches?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/matches');
    }
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-1 group">
              <div className="flex items-center">
                <span className="text-base lg:text-lg font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:via-purple-600/80 group-hover:to-pink-600/80 transition-all duration-300">
                  AI Complete Me
                </span>
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-purple-600 rounded-full ml-1 group-hover:scale-125 transition-transform duration-300"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Echo Section */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">|</span>
              <span className="text-xs font-medium text-purple-600">Echo</span>
              {echoNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                    isActive(item.href)
                      ? "text-purple-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-primary ${
                    isActive(item.href)
                      ? "text-primary bg-muted"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Echo Section Mobile */}
              <div className="border-t border-border mt-3 pt-3">
                <div className="px-3 py-1">
                  <span className="text-sm font-medium text-purple-600">Echo Features</span>
                </div>
                {echoNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 text-base font-medium transition-colors hover:text-purple-600 ${
                      isActive(item.href)
                        ? "text-purple-600 bg-purple-50"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="px-3 py-2 border-t border-border mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowSearchModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
              <div className="px-3 py-2 border-t border-border mt-4">
                {user ? (
                  <div className="space-y-2">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
        <DialogContent className="max-w-[95vw] w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Search for Connections</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search by keywords, interests, or location</label>
              <Input
                type="text"
                placeholder="e.g., hiking, photography, NYC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full"
              />
            </div>

            <SearchFilters
              onFiltersChange={handleFiltersChange}
              onPreferenceChange={handlePreferenceChange}
              onZipCodeChange={handleZipCodeChange}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSearch} className="flex-1 w-full">
                Search Now
              </Button>
              <Button variant="outline" onClick={() => setShowSearchModal(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>

            {!isEchoActive && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Free Tier Includes:</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Basic compatibility matching</p>
                  <p>• All gender preference options</p>
                  <p>• Limited advanced filters</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full"
                  onClick={() => {
                    setShowSearchModal(false);
                    navigate('/subscription');
                  }}
                >
                  <span className="mr-2">👑</span>
                  Upgrade for Unlimited Filters
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};