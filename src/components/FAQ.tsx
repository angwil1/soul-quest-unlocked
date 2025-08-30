import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageCircle, Heart, Shield, Star, Users } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqs = [
    {
      id: "what-is-soulquest",
      icon: Heart,
      question: "What makes SoulQuest different from other dating apps?",
      answer: "SoulQuest focuses on deep, meaningful connections through emotional intelligence and AI-powered compatibility matching. Instead of superficial swiping, we help you discover genuine compatibility based on values, personality, and life goals.",
      category: "About"
    },
    {
      id: "how-matching-works",
      icon: Star,
      question: "How does the AI matching algorithm work?",
      answer: "Our advanced AI analyzes your personality traits, communication style, values, and relationship goals to identify truly compatible matches. The more you engage with the app, the better it becomes at finding your perfect match.",
      category: "Matching"
    },
    {
      id: "privacy-safety",
      icon: Shield,
      question: "How do you protect my privacy and safety?",
      answer: "Your safety is our top priority. We use military-grade encryption, comprehensive verification processes, and advanced fraud detection. You control who sees your information and can block or report anyone at any time.",
      category: "Safety"
    },
    {
      id: "premium-features",
      icon: Star,
      question: "What premium features are available?",
      answer: "Premium members get unlimited matches, advanced filtering options, read receipts, priority customer support, and exclusive events. Plus access to our Connection DNA analysis and Memory Vault features.",
      category: "Premium"
    },
    {
      id: "getting-started",
      icon: Users,
      question: "How do I get started on SoulQuest?",
      answer: "Simply sign up, complete our personality assessment, add your photos and preferences, and start discovering meaningful connections. Our onboarding process takes about 10 minutes and helps us understand what you're looking for.",
      category: "Getting Started"
    },
    {
      id: "success-stories",
      icon: Heart,
      question: "Do people really find lasting relationships here?",
      answer: "Yes! We have thousands of success stories from couples who found lasting love through SoulQuest. Our focus on compatibility and meaningful connections leads to higher success rates than traditional dating apps.",
      category: "Success"
    }
  ];

  const handleValueChange = (value: string[]) => {
    setOpenItems(value);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 mb-6">
            <HelpCircle className="h-5 w-5 mr-3 text-primary" />
            <span className="text-sm font-medium text-primary">
              Frequently Asked Questions
            </span>
          </div>
          <h2 className="text-4xl font-serif font-light text-foreground mb-4">
            Everything you need to know
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to the most common questions about SoulQuest and finding meaningful connections.
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <MessageCircle className="h-6 w-6 text-primary" />
              Common Questions
            </CardTitle>
            <CardDescription>
              Can't find what you're looking for? Contact our support team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion 
              type="multiple" 
              value={openItems}
              onValueChange={handleValueChange}
              className="space-y-4"
            >
              {faqs.map((faq, index) => {
                const IconComponent = faq.icon;
                return (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id}
                    className="border border-border/50 rounded-lg px-6 py-2 hover:border-primary/30 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    <AccordionTrigger className="hover:no-underline group">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium group-hover:text-primary transition-colors duration-200">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-2">
                      <div className="pl-12 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support CTA */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Card className="p-4 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors duration-200 cursor-pointer hover:scale-105 transform">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium text-sm">Live Chat Support</div>
                  <div className="text-xs text-muted-foreground">Available 24/7</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 transition-colors duration-200 cursor-pointer hover:scale-105 transform">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-purple-500" />
                <div className="text-left">
                  <div className="font-medium text-sm">Help Center</div>
                  <div className="text-xs text-muted-foreground">Browse guides & tutorials</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;