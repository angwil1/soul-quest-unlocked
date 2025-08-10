import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Filter } from "lucide-react";
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
    // Convert preference to gender filter format using correct singular forms
    const genderMap: Record<string, string[]> = {
      'men': ['man'],
      'women': ['woman'], 
      'non-binary': ['non-binary'],
      'all': ['all']
    };
    
    if (genderMap[preference]) {
      setSelectedFilters(genderMap[preference]);
    }
  };

  const handleZipCodeChange = (zip: string) => {
    setZipCode(zip);
  };

  const handleSearch = () => {
    setShowSearchModal(false);
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    
    if (searchPreference) {
      params.set('preference', searchPreference);
    }
    
    if (zipCode) {
      params.set('zip', zipCode);
    }
    
    const queryString = params.toString();
    navigate(`/matches${queryString ? `?${queryString}` : ''}`);
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
        <DialogContent className="max-w-[95vw] w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-4">
            <DialogTitle className="text-xl font-bold flex items-center justify-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Find Your Perfect Match
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Discover meaningful connections based on your preferences
            </p>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Main Search Input */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Try: hiking, coffee lover, Portland..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 h-12 text-base border-2 focus:border-primary"
                />
              </div>
              <p className="text-xs text-muted-foreground px-1">
                💡 Search by interests, hobbies, location, or occupation
              </p>
            </div>

            {/* Preferences Section */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Refine Your Search
              </h3>
              
              <SearchFilters
                onFiltersChange={handleFiltersChange}
                onPreferenceChange={handlePreferenceChange}
                onZipCodeChange={handleZipCodeChange}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={handleSearch} className="w-full h-12 text-base font-semibold">
                <Search className="h-4 w-4 mr-2" />
                Start Searching
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSearchModal(false)} 
                className="w-full h-10"
              >
                Maybe Later
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