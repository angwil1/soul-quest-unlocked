import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const FAQ = () => {
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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Navbar />
      
      <main 
        className="container mx-auto px-4 py-12"
        role="main"
        aria-labelledby="faq-title"
      >
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 
              id="faq-title"
              className="text-4xl font-bold text-foreground mb-4"
            >
              Frequently Asked Questions
            </h1>
            <p 
              className="text-xl text-muted-foreground"
              role="text"
              aria-describedby="faq-title"
            >
              Everything you need to know about AI Complete Me
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle 
                id="faq-section-title"
                className="text-2xl"
              >
                Common Questions
              </CardTitle>
              <CardDescription>
                Browse through our most frequently asked questions or use keyboard navigation to explore.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion 
                type="single" 
                collapsible 
                className="w-full"
                role="region"
                aria-labelledby="faq-section-title"
              >
                {faqs.map((faq, index) => (
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
                    >
                      <span className="font-medium text-foreground">
                        {faq.question}
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

          <section className="mt-16 p-6 bg-muted/50 rounded-lg" aria-labelledby="accessibility-info">
            <h2 
              id="accessibility-info"
              className="text-xl font-semibold mb-3 text-foreground"
            >
              Accessibility Information
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              This FAQ page and all AI Complete Me features are designed to be accessible to users with disabilities. 
              We follow WCAG 2.1 AA guidelines and continuously improve our accessibility.
            </p>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="font-medium min-w-0 flex-shrink-0">Keyboard Navigation:</span>
                <span>Use Tab to navigate, Enter/Space to activate, Arrow keys in accordion</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium min-w-0 flex-shrink-0">Screen Readers:</span>
                <span>Full compatibility with NVDA, JAWS, VoiceOver, and other assistive technologies</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium min-w-0 flex-shrink-0">Visual:</span>
                <span>High contrast ratios, clear focus indicators, adjustable text sizes</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FAQ;