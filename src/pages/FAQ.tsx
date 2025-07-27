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