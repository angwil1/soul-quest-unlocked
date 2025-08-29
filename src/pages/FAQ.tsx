import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const FAQ = () => {
  const faqs = [
    {
      question: "What's included in each tier?",
      answer: "Free: A quiet start. You get access to basic matching, public prompts, and core connection tools—with no pressure.\n\nComplete Plus: Everything in Free, plus deeper compatibility quizzes, private Match Memory, and early access to new features. You're signaling you're ready for more emotional texture.\n\nComplete Beyond: A full emotional toolkit. Includes everything above—plus Memory Vault to save connection moments, Connection DNA for deep emotional mirroring, and poetic onboarding overlays for when you need a fresh start."
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
      answer: "We offer a free tier with basic features, and paid plans starting at $12/month for advanced features like video chat, read receipts, and priority matching."
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
      question: "What's the difference between Free and Complete Beyond emotionally?",
      answer: "Free is like browsing poetry in a bookstore. Complete Beyond lets you write in the margins, remember what moved you, and take the book home. One is nice; the other is deeply yours."
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
      answer: "Yes, we are committed to making AI Complete Me accessible to all users. We follow WCAG guidelines and continuously work to improve accessibility. View our full accessibility statement for detailed information about our accessibility features and ongoing efforts."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about AI Complete Me
            </p>
          </div>


          <Card>
            <CardHeader>
              <CardTitle>Common Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Contact our support team.
            </p>
            <Button variant="outline">Contact Support</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;