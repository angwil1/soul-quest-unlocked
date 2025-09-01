import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, Search, BookOpen, HelpCircle, Mail } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const faqs = [
    {
      question: "What's included in each tier?",
      answer: "Quiet Start: A gentle beginning. You get access to basic matching, public prompts, and core connection tools—with no pressure.\n\nComplete Plus: Everything in Quiet Start, plus deeper compatibility quizzes, private Match Memory, and early access to new features. You're signaling you're ready for more emotional texture.\n\nComplete Beyond: A full emotional toolkit. Includes everything above—plus Memory Vault to save connection moments, Connection DNA for deep emotional mirroring, and poetic onboarding overlays for when you need a fresh start."
    },
    {
      question: "How does AI Complete Me work?",
      answer: "AI Complete Me uses advanced AI matching algorithms to connect you with compatible partners based on your personality, interests, and values. Complete our comprehensive quiz to get started."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take privacy seriously. All personal data is encrypted and we never share your information with third parties without your explicit consent."
    },
    {
      question: "What makes AI Complete Me different from other dating apps?",
      answer: "We focus on meaningful connections through deep personality analysis, AI-powered matching, and features like video chat to help you build authentic relationships."
    },
    {
      question: "How much does AI Complete Me cost?",
      answer: "We offer a Quiet Start tier with basic features, and paid plans starting at $12/month for advanced features like video chat, read receipts, and priority matching."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time through your account settings or billing portal. You'll continue to have access to premium features until your current billing period ends."
    },
    {
      question: "How do I delete my account?",
      answer: "You can delete your account through your profile settings. This action is permanent and will remove all your data from our servers."
    },
    {
      question: "💾 What is the Memory Vault?",
      answer: "Memory Vault lives inside Complete Beyond. It lets you save favorite matches, prompts, and connection moments. It's your emotional archive—a way to revisit the sparks that matter."
    },
    {
      question: "🔐 Is my data safe here?",
      answer: "Yes. We do not sell or share your data. We believe privacy is the foundation of trust. You're not the product—you're the protagonist."
    },
    {
      question: "What if I'm not getting matches?",
      answer: "Try updating your profile with more photos and information, retaking the personality quiz, or upgrading to a premium plan for visibility boosts and priority matching."
    },
    {
      question: "Do I have to reveal everything about myself to use AI Complete Me?",
      answer: "Nope. Vulnerability is earned, not demanded. You can start light, get your footing, and choose what to share when you're ready. Privacy-first means you control the pace."
    },
    {
      question: "What does \"emotionally intelligent matchmaking\" actually mean?",
      answer: "It means we don't just sort you by location or age—we pay attention to emotional patterns, compatibility signals, and storytelling layers. Your inner world matters here."
    },
    {
      question: "What's the difference between Quiet Start and Complete Beyond emotionally?",
      answer: "Quiet Start is like browsing poetry in a bookstore. Complete Beyond lets you write in the margins, remember what moved you, and take the book home. One is nice; the other is deeply yours."
    },
    {
      question: "🛠️ Will AI Complete Me keep changing over time?",
      answer: "Yes—and that's the point. We're building this with you. Features will evolve based on emotional feedback, not market trends. Early users help steer the ship."
    },
    {
      question: "🎁 Can I gift a subscription to someone?",
      answer: "Not yet—but this is on our radar. We believe generosity should be built-in, and we're exploring gift subscriptions as a future feature. Stay tuned."
    },
    {
      question: "📷 Can I turn off premium features once I've activated them?",
      answer: "Always. You can toggle any premium features, hide content, or adjust your visibility at any time. Flexibility adapts to your comfort."
    },
    {
      question: "What if I want to delete my account or data?",
      answer: "You can fully delete your account and associated data in just a few taps. No hoops, no guilt trips. We'll miss you, but you won't leave footprints."
    },
    {
      question: "⏳ Do I have to wait for matches to appear?",
      answer: "You might see quiet spells, especially early on. That's intentional. We focus on quality and emotional fit—not flooding your inbox. Sometimes the best connections bloom slowly."
    },
    {
      question: "🧠 How does the AI matchmaking work?",
      answer: "It learns from emotional cues—not just age or location. Over time, it maps your responses, vibe tags, and story layers to surface real resonance."
    },
    {
      question: "🚫 Will people see when I've saved them in Memory Vault?",
      answer: "Nope. Memory Vault is fully private. It's your archive of emotional moments—not a public signal."
    },
    {
      question: "🔍 Do you have any verification or moderation?",
      answer: "Not yet—but we're exploring consent-based, privacy-first options. We want safety without surveillance."
    },
    {
      question: "Can I use AI Complete Me for friendship, not dating?",
      answer: "Yes. Connection doesn't always mean romance. We're exploring an Intent overlay that lets you define what you're here for—softness, curiosity, co-thought."
    },
    {
      question: "👥 Will people know what tier I'm on?",
      answer: "Only if you want them to. Badges are toggleable. You choose what you signal."
    },
    {
      question: "🎨 Can I change my profile later?",
      answer: "Yes, whenever you want. Your profile can evolve—and our features let you reflect that freely."
    },
    {
      question: "🛬 I signed up, but nothing's happening. Did I do something wrong?",
      answer: "Not at all. Sometimes emotional resonance takes time. If you've filled out your profile and nothing appears yet, trust the quiet. It's a feature, not a bug."
    },
    {
      question: "Does the AI guarantee love or perfect matches?",
      answer: "No. That's not its job. The AI observes patterns and emotional cues—it doesn't make promises. Connection requires curiosity, presence, and trust. We just help you notice more."
    },
    {
      question: "Does the AI guarantee romantic results?",
      answer: "AI Complete Me doesn't promise romantic destiny. It offers emotional clarity, gentle insight, and space to reflect on what truly resonates."
    },
    {
      question: "How does the video chat feature work?",
      answer: "Video chat is available for premium subscribers. Once you match with someone, you can initiate a video call directly through the app for safe, secure conversations."
    },
    {
      question: "Is AI Complete Me accessible to users with disabilities?",
      answer: "Yes, we are committed to making AI Complete Me accessible to all users. We follow WCAG 2.1 AA guidelines and continuously work to improve accessibility across all features including: keyboard navigation support, screen reader compatibility, high contrast mode, adjustable text sizes, clear focus indicators, alternative text for images, and semantic HTML structure. Our Memory Vault, AI Digest, Connection DNA, and FAQ pages all include comprehensive accessibility features. We welcome feedback from users with disabilities to help us continue improving. View our full accessibility statement for detailed information."
    },
    {
      question: "What accessibility features are available?",
      answer: "AI Complete Me includes comprehensive accessibility features: Full keyboard navigation throughout the app, ARIA labels and live regions for screen readers, semantic HTML structure, high contrast color ratios, adjustable text sizes, focus management and visible focus indicators, alternative text for all images and icons, accessible form controls with proper labeling, skip navigation links, and compatibility with assistive technologies. All major features including matching, messaging, profiles, Memory Vault, AI Digest, and Connection DNA are designed to be fully accessible."
    },
    {
      question: "How can I adjust the app for my accessibility needs?",
      answer: "You can customize AI Complete Me for your needs through: Your device's accessibility settings for text size, contrast, and screen reader preferences, keyboard shortcuts for navigation and actions, alternative input methods support, high contrast mode in your browser or device settings, and voice control compatibility. If you need specific accommodations or encounter accessibility barriers, please contact our support team for assistance."
    },
    {
      question: "What assistive technologies does AI Complete Me support?",
      answer: "AI Complete Me is compatible with all major assistive technologies including: Screen readers (NVDA, JAWS, VoiceOver, TalkBack), Voice control software (Dragon NaturallySpeaking, Voice Control), Switch navigation devices, Eye-tracking systems, Keyboard alternatives and on-screen keyboards, Browser zoom up to 200%, and High contrast/dark mode extensions. Our development team regularly tests with these technologies to ensure seamless compatibility."
    },
    {
      question: "How do I report accessibility issues or request accommodations?",
      answer: "If you encounter any accessibility barriers or need specific accommodations, please contact our accessibility team at accessibility@aicomplete.me or use our accessible contact form. We are committed to resolving accessibility issues promptly and providing alternative access methods when needed. Your feedback helps us improve the experience for all users with disabilities."
    },
    {
      question: "Are there keyboard shortcuts for navigating AI Complete Me?",
      answer: "Yes! AI Complete Me includes comprehensive keyboard navigation: Tab/Shift+Tab to move between elements, Enter/Space to activate buttons and links, Arrow keys in menus and accordions, Escape to close dialogs and menus, Alt+S to skip to main content, and Alt+M to access the main navigation menu. All interactive elements are reachable via keyboard, and focus indicators clearly show your current position."
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      
      <Navbar />
      
      {/* Header with Back Button and Actions */}
      <header className="bg-card border-b" role="banner">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Go back to homepage"
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back to Home
            </Button>
            
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/contact')}
                className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full xs:w-auto justify-center"
                aria-label="Contact support for additional help"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span className="sm:inline">Contact Support</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/accessibility')}
                className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full xs:w-auto justify-center"
                aria-label="View full accessibility statement"
              >
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
                <span className="sm:inline">Accessibility Statement</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main 
        id="main-content"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12"
        role="main"
        aria-labelledby="faq-title"
      >
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" aria-hidden="true" />
              <h1 
                id="faq-title"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-center"
              >
                Frequently Asked Questions
              </h1>
            </div>
            <p 
              className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-4 sm:mb-6 px-4"
              role="text"
              aria-describedby="faq-title"
            >
              Everything you need to know about AI Complete Me
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Search through FAQ questions and answers"
                />
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2" role="status" aria-live="polite">
                  {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'} found
                </p>
              )}
            </div>
          </header>

          <Card role="region" aria-labelledby="faq-section-title">
            <CardHeader>
              <CardTitle 
                id="faq-section-title"
                className="text-2xl flex items-center gap-2"
              >
                {searchQuery ? `Search Results (${filteredFaqs.length})` : 'Common Questions'}
              </CardTitle>
              <CardDescription>
                {searchQuery 
                  ? `Showing ${filteredFaqs.length} questions matching "${searchQuery}"`
                  : 'Browse through our most frequently asked questions or use the search above to find specific topics. Use Tab to navigate between questions, Enter or Space to expand answers.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8" role="status">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No questions found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any questions matching "{searchQuery}". Try different keywords or browse all questions.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery("")}
                    className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Clear search and show all questions"
                  >
                    Show All Questions
                  </Button>
                </div>
              ) : (
                <Accordion 
                  type="single" 
                  collapsible 
                  className="w-full"
                  role="region"
                  aria-labelledby="faq-section-title"
                >
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="border-b border-border"
                    >
                      <AccordionTrigger 
                        className="text-left hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-4 transition-colors"
                        aria-expanded="false"
                        aria-controls={`faq-content-${index}`}
                        id={`faq-question-${index}`}
                        aria-describedby={`faq-hint-${index}`}
                      >
                        <span className="font-medium text-foreground">
                          {faq.question}
                        </span>
                        <span id={`faq-hint-${index}`} className="sr-only">
                          Press Enter or Space to expand answer
                        </span>
                      </AccordionTrigger>
                      <AccordionContent 
                        className="text-muted-foreground pb-6 pt-2 px-2"
                        id={`faq-content-${index}`}
                        aria-labelledby={`faq-question-${index}`}
                        role="region"
                      >
                        <div className="whitespace-pre-line leading-relaxed">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>

          <section className="text-center mt-12" aria-labelledby="support-heading">
            <h2 
              id="support-heading"
              className="text-2xl font-bold mb-4 text-foreground"
            >
              Still have questions?
            </h2>
            <p 
              className="text-muted-foreground mb-6"
              role="text"
            >
              Can't find what you're looking for? Contact our support team for personalized assistance.
            </p>
            <Button 
              variant="outline"
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Contact our support team for help with questions not covered in the FAQ"
            >
              Contact Support
            </Button>
          </section>

          <section className="mt-16 space-y-8" aria-labelledby="accessibility-comprehensive-info">
            <div className="text-center">
              <h2 
                id="accessibility-comprehensive-info"
                className="text-2xl font-bold mb-4 text-foreground"
              >
                🌟 Complete Accessibility Information
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                AI Complete Me is designed to be fully accessible to users with disabilities. 
                We follow WCAG 2.1 AA guidelines and continuously improve based on your feedback.
              </p>
            </div>
            
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Navigation & Controls */}
              <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg">⌨️</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Navigation & Controls</h3>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground text-xs sm:text-sm">Keyboard Navigation:</span>
                    <p className="mt-0.5 sm:mt-1 leading-relaxed">Tab to navigate, Enter/Space to activate, Arrow keys in menus</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground text-xs sm:text-sm">Skip Links:</span>
                    <p className="mt-0.5 sm:mt-1 leading-relaxed">Jump directly to main content, bypassing navigation</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground text-xs sm:text-sm">Focus Indicators:</span>
                    <p className="mt-0.5 sm:mt-1 leading-relaxed">Clear visual focus rings show your current position</p>
                  </div>
                </div>
              </Card>
              
              {/* Assistive Technology */}
              <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg">🔊</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Assistive Technology</h3>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground text-xs sm:text-sm">Screen Readers:</span>
                    <p className="mt-0.5 sm:mt-1 leading-relaxed">NVDA, JAWS, VoiceOver, TalkBack compatibility</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground text-xs sm:text-sm">Voice Control:</span>
                    <p className="mt-0.5 sm:mt-1 leading-relaxed">Dragon NaturallySpeaking, Voice Control support</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground text-xs sm:text-sm">Switch Navigation:</span>
                    <p className="mt-0.5 sm:mt-1 leading-relaxed">Compatible with switch devices and eye-tracking</p>
                  </div>
                </div>
              </Card>
              
              {/* Visual & Cognitive */}
              <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg">👁️</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Visual & Cognitive</h3>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground text-xs sm:text-sm">High Contrast:</span>
                    <p className="mt-0.5 sm:mt-1 leading-relaxed">Enhanced contrast ratios, dark mode support</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground text-xs sm:text-sm">Text Scaling:</span>
                    <p className="mt-0.5 sm:mt-1 leading-relaxed">Browser zoom up to 200% without horizontal scrolling</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground text-xs sm:text-sm">Clear Language:</span>
                    <p className="mt-0.5 sm:mt-1 leading-relaxed">Simple, consistent interface language and structure</p>
                  </div>
                </div>
              </Card>
              
              {/* Content & Structure */}
              <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg">🏗️</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Content & Structure</h3>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground text-xs sm:text-sm">Semantic HTML:</span>
                    <p className="mt-0.5 sm:mt-1 leading-relaxed">Proper headings, landmarks, and ARIA labels</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground text-xs sm:text-sm">Alternative Text:</span>
                    <p className="mt-0.5 sm:mt-1 leading-relaxed">Descriptive alt text for all images and media</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground text-xs sm:text-sm">Live Regions:</span>
                    <p className="mt-0.5 sm:mt-1 leading-relaxed">Screen reader announcements for dynamic content</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Card */}
            <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border-primary/20">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl sm:text-2xl">💬</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary">Need Help or Have Feedback?</h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2 leading-relaxed">
                  Contact our accessibility team at 
                  <span className="font-semibold text-foreground"> accessibility@aicomplete.me</span> or through our accessible contact form. 
                  We're committed to resolving accessibility barriers and providing accommodations.
                </p>
                <div className="pt-1 sm:pt-2">
                  <Button 
                    variant="outline" 
                    className="bg-background hover:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base px-4 sm:px-6"
                    aria-label="Contact accessibility team for support"
                  >
                    Contact Accessibility Team
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FAQ;