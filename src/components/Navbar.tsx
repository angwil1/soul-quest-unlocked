import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Filter, LogOut, User, Archive, Dna, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import SearchFilters from "@/components/SearchFilters";
import { supabase } from "@/integrations/supabase/client";
import { useMemoryVault } from "@/hooks/useMemoryVault";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchPreference, setSearchPreference] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [newMemoriesCount, setNewMemoriesCount] = useState(0);
  const [isUnlockedBeyond, setIsUnlockedBeyond] = useState(false);
  const { getNewMemoriesCount } = useMemoryVault();
  
  // Debug logging
  console.log('Navbar: user authenticated?', !!user);
  console.log('Navbar: isUnlockedBeyond?', isUnlockedBeyond);

  // Check for new memories
  useEffect(() => {
    const checkNewMemories = async () => {
      if (!user) {
        setNewMemoriesCount(0);
        return;
      }

      try {
        const count = await getNewMemoriesCount();
        setNewMemoriesCount(count);
      } catch (error) {
        console.error('Error checking new memories:', error);
        setNewMemoriesCount(0);
      }
    };

    checkNewMemories();
    
    // Check every 5 minutes
    const interval = setInterval(checkNewMemories, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, getNewMemoriesCount]);

  // Check if user has completed quiz and subscription status
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) {
        setHasCompletedQuiz(false);
        setIsUnlockedBeyond(false);
        return;
      }

      try {
        // Check quiz completion
        const { data: quizData } = await supabase
          .from('user_events')
          .select('*')
          .eq('user_id', user.id)
          .eq('event_type', 'quiz_completed')
          .limit(1);
        
        setHasCompletedQuiz(quizData && quizData.length > 0);

        // Check subscription status - for now just checking if profile exists with beyond features
        const { data: profileData } = await supabase
          .from('profiles')
          .select('unlocked_beyond_badge_enabled')
          .eq('id', user.id)
          .single();
        
        setIsUnlockedBeyond(profileData?.unlocked_beyond_badge_enabled || false);
      } catch (error) {
        console.error('Error checking user status:', error);
        setHasCompletedQuiz(false);
        setIsUnlockedBeyond(false);
      }
    };

    checkUserStatus();
  }, [user]);

  const navigation = [
    { name: "Discover", href: "/quick-start" },
    { name: "Browse Profiles", href: "/browse" },
    { name: "Matches", href: "/matches" },  
    { name: "Messages", href: "/messages" },
    { name: "Memory Vault", href: "/memory-vault" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
  ];

  const isActive = (path: string) => location.pathname === path;

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

  const handleMobileLogout = async () => {
    // Add haptic feedback for mobile apps
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Light haptic feedback
    }
    
    await signOut();
    setIsMenuOpen(false);
    navigate('/');
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
            {navigation.map((item) => {
              // Handle authentication-required links
              if (item.name === "Browse Profiles" && !user) {
                return (
                  <Link
                    key={item.name}
                    to="/quick-start"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.href)
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  } ${item.name === "Memory Vault" ? "relative" : ""}`}
                >
                  {item.name}
                  {item.name === "Memory Vault" && newMemoriesCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                      {newMemoriesCount > 9 ? '9+' : newMemoriesCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Only show search on matches/browse pages */}
            {user && hasCompletedQuiz && (location.pathname === '/matches' || location.pathname === '/browse') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearchModal(true)}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Filter Results
              </Button>
            )}
            {user ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        if (isUnlockedBeyond) {
                          navigate('/connection-dna');
                        } else {
                          navigate('/pricing');
                        }
                      }}
                      className="flex items-center"
                    >
                      <Dna className="h-4 w-4 mr-2" />
                      Connection DNA Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button - Android optimized */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="min-h-[44px] min-w-[44px] p-3 touch-target"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Android optimized */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-3 pt-4 pb-6 space-y-2 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              {navigation.map((item) => {
                // Handle authentication-required links
                const linkTo = (item.name === "Browse Profiles" && !user) ? "/quick-start" : item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={linkTo}
                    className={`block px-4 py-3 text-base font-medium transition-all duration-200 rounded-xl touch-target ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    } ${item.name === "Memory Vault" ? "relative" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      {item.name === "Memory Vault" && newMemoriesCount > 0 && (
                        <span className="ml-2 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                          {newMemoriesCount > 9 ? '9+' : newMemoriesCount}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
              {/* Only show search on matches/browse pages - Android optimized */}
              {user && hasCompletedQuiz && (location.pathname === '/matches' || location.pathname === '/browse') && (
                <div className="px-4 py-3 border-t border-border mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowSearchModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start flex items-center gap-3 px-4 py-3 text-base touch-target rounded-xl"
                  >
                    <Search className="h-5 w-5" />
                    Filter Results
                  </Button>
                </div>
              )}
              <div className="px-4 py-4 border-t border-border mt-4">
                {user ? (
                  <div className="space-y-3">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start flex items-center gap-3 px-4 py-3 text-base touch-target rounded-xl">
                        <User className="h-5 w-5" />
                        View Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start flex items-center gap-3 px-4 py-3 text-base touch-target rounded-xl"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (isUnlockedBeyond) {
                          navigate('/connection-dna');
                        } else {
                          navigate('/pricing');
                        }
                      }}
                    >
                      <Dna className="h-5 w-5" />
                      Connection DNA Profile
                    </Button>
                    <div className="border-t border-border pt-4 space-y-2">
                      <Link to="/privacy" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-muted-foreground px-4 py-3 touch-target rounded-xl">
                          Privacy Policy
                        </Button>
                      </Link>
                      <Link to="/terms" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-muted-foreground px-4 py-3 touch-target rounded-xl">
                          Terms of Service
                        </Button>
                      </Link>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full justify-start flex items-center gap-3 px-4 py-3 text-base touch-target rounded-xl mt-4"
                      onClick={handleMobileLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="w-full mb-4 px-4 py-3 text-base touch-target rounded-xl">Sign In</Button>
                    </Link>
                    <div className="space-y-2">
                      <Link to="/privacy" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-muted-foreground px-4 py-3 touch-target rounded-xl">
                          Privacy Policy
                        </Button>
                      </Link>
                      <Link to="/terms" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-muted-foreground px-4 py-3 touch-target rounded-xl">
                          Terms of Service
                        </Button>
                      </Link>
                    </div>
                  </>
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
                Find Matches
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSearchModal(false)} 
                className="w-full h-10"
              >
                Maybe Later
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};