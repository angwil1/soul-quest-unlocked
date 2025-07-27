import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const FAQ = () => {
  const faqs = [
    {
      question: "What's included in each tier?",
      answer: "Free: A quiet start. You get access to basic matching, public prompts, and core connection tools—with no pressure.\n\nUnlocked+: Everything in Free, plus deeper compatibility quizzes, private Match Memory, and early access to new features. You're signaling you're ready for more emotional texture.\n\nUnlocked Beyond: A full emotional toolkit. Includes everything above—plus Memory Vault to save connection moments, Connection DNA for deep emotional mirroring, and poetic onboarding overlays for when you need a fresh start."
    },
    {
      question: "What is Unlocked Echo, and who can use it?",
      answer: "Echo is a creative expression add-on—featuring TikTok-style profiles, emotional soundtracks, vibe galleries, and optional Echo badges.\n\nAdd Unlocked Echo to any plan, or purchase on its own. Expression isn't reserved for premium—it's available to all.\n\n• Monthly ($4/mo) or one-time ($12) pricing\n• Echo is not required for matching—it's for emotional self-presentation\n• You can hide Echo features at any time—privacy always comes first"
    },
    {
      question: "How does DateSync work?",
      answer: "DateSync uses advanced AI matching algorithms to connect you with compatible partners based on your personality, interests, and values. Complete our comprehensive quiz to get started."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take privacy seriously. All personal data is encrypted and we never share your information with third parties without your explicit consent."
    },
    {
      question: "What makes DateSync different from other dating apps?",
      answer: "We focus on meaningful connections through deep personality analysis, AI-powered matching, and features like video chat to help you build authentic relationships."
    },
    {
      question: "How much does DateSync cost?",
      answer: "We offer a free tier with basic features, and paid plans starting at $9.99/month for advanced features like video chat, read receipts, and priority matching."
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
      answer: "Memory Vault lives inside Unlocked Beyond. It lets you save favorite matches, prompts, and connection moments. It's your emotional archive—a way to revisit the sparks that matter."
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
      question: "Do I have to reveal everything about myself to use GetUnlocked?",
      answer: "Nope. Vulnerability is earned, not demanded. You can start light, get your footing, and choose what to share when you're ready. Privacy-first means you control the pace."
    },
    {
      question: "What does \"emotionally intelligent matchmaking\" actually mean?",
      answer: "It means we don't just sort you by location or age—we pay attention to emotional patterns, compatibility signals, and storytelling layers. Your inner world matters here."
    },
    {
      question: "What's the difference between Free and Unlocked Beyond emotionally?",
      answer: "Free is like browsing poetry in a bookstore. Unlocked Beyond lets you write in the margins, remember what moved you, and take the book home. One is nice; the other is deeply yours."
    },
    {
      question: "🛠️ Will GetUnlocked keep changing over time?",
      answer: "Yes—and that's the point. We're building this with you. Features will evolve based on emotional feedback, not market trends. Early users help steer the ship."
    },
    {
      question: "🎁 Can I gift a subscription or Echo add-on to someone?",
      answer: "Not yet—but this is on our radar. We believe generosity should be built-in, and we're exploring \"Matchlight Gifts\" as a future feature. Stay tuned."
    },
    {
      question: "📷 Can I turn off Echo features once I've activated them?",
      answer: "Always. Expressiveness should never feel performative. You can toggle badges, hide media, or mute your soundtrack any time. Echo adapts to your comfort."
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
      question: "Can I use GetUnlocked for friendship, not dating?",
      answer: "Yes. Connection doesn't always mean romance. We're exploring an Intent overlay that lets you define what you're here for—softness, curiosity, co-thought."
    },
    {
      question: "👥 Will people know what tier I'm on?",
      answer: "Only if you want them to. Badges like Echo or Unlocked Beyond are toggleable. You choose what you signal."
    },
    {
      question: "🎨 Can I change my profile vibe or soundtrack later?",
      answer: "Yes, whenever you want. Your emotional palette can evolve—and Echo lets you reflect that freely."
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
      question: "How does the video chat feature work?",
      answer: "Video chat is available for premium subscribers. Once you match with someone, you can initiate a video call directly through the app for safe, secure conversations."
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
              Everything you need to know about DateSync
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>
                New to DateSync? Here's how to get started in 3 simple steps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-primary mb-2">1</div>
                  <h3 className="font-semibold mb-2">Create Account</h3>
                  <p className="text-sm text-muted-foreground">Sign up and complete your profile</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-primary mb-2">2</div>
                  <h3 className="font-semibold mb-2">Take Quiz</h3>
                  <p className="text-sm text-muted-foreground">Complete our personality assessment</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-primary mb-2">3</div>
                  <h3 className="font-semibold mb-2">Find Matches</h3>
                  <p className="text-sm text-muted-foreground">Connect with compatible partners</p>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <Link to="/auth">
                  <Button>Get Started</Button>
                </Link>
                <Link to="/questions">
                  <Button variant="outline">Take Quiz</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Why Dating Tips Work</CardTitle>
              <CardDescription>
                Creating meaningful connections through thoughtful guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Build Trust</h3>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re not just selling features—you&apos;re guiding users through an emotional journey. Tips show care.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Reduce Anxiety</h3>
                  <p className="text-sm text-muted-foreground">
                    New users often feel unsure how to start conversations or present themselves. A gentle nudge goes a long way.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Set the Tone</h3>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re shaping culture. Your platform isn&apos;t hookup-centric or transactional—it&apos;s about meaningful connection.
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span className="text-green-500">🌿</span>
                  Connection Tips
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                    &quot;Start with a story—not a résumé. Let them feel who you are.&quot;
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                    &quot;If you&apos;re nervous, say so. Vulnerability builds bridges.&quot;
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                    &quot;Don&apos;t rush past silence. Emotional resonance often blooms there.&quot;
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                    &quot;Curate your Echo. Your soundtrack says a lot.&quot;
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-muted md:col-span-2">
                    &quot;Ask before sharing deeper layers. Consent is sexy.&quot;
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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