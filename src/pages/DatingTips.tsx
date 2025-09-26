import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Heart, MessageCircle, Camera, Shield, Coffee, Users, CheckCircle } from 'lucide-react';

const DatingTips = () => {
  const tipCategories = [
    {
      id: 'profile',
      title: 'Profile Tips',
      icon: Camera,
      color: 'bg-blue-500',
      tips: [
        {
          title: 'Photos that actually work',
          content: 'Use natural lighting - bathroom mirrors never look good. One clear face shot, one full body, and one doing something you enjoy. Skip the group photos where no one knows which person you are.',
          practical: true
        },
        {
          title: 'Write a bio people remember',
          content: 'Mention specific things you do, not generic traits. "I make killer pancakes on Sunday mornings" beats "I love to laugh" every time.',
          practical: true
        },
        {
          title: 'Be specific about interests',
          content: 'Instead of "love music," try "currently obsessed with indie folk playlists." It gives people something real to connect with.',
          practical: false
        }
      ]
    },
    {
      id: 'messaging',
      title: 'Messaging',
      icon: MessageCircle,
      color: 'bg-green-500',
      tips: [
        {
          title: 'First messages that get responses',
          content: 'Ask about something specific from their profile. "I saw you went to that new coffee place - was it worth the hype?" works better than "hey beautiful."',
          practical: true
        },
        {
          title: 'Keep conversations balanced',
          content: 'Match their energy level. If they send paragraph responses, you can too. If they keep it short, follow their lead.',
          practical: true
        },
        {
          title: 'Move offline when it feels right',
          content: 'If you\'ve been chatting for a few days and it\'s going well, suggest meeting up. "Want to check out that farmers market this weekend?" is casual and low-pressure.',
          practical: true
        }
      ]
    },
    {
      id: 'first-dates',
      title: 'First Dates',
      icon: Coffee,
      color: 'bg-purple-500',
      tips: [
        {
          title: 'Pick the right location',
          content: 'Coffee, lunch, or a casual walk work best. Save dinner for when you know you actually like each other - nobody wants to be stuck at a fancy restaurant with someone they don\'t click with.',
          practical: true
        },
        {
          title: 'Conversation flow',
          content: 'Ask follow-up questions about things they mention. If they say they work in marketing, ask what kind of campaigns they work on. Show genuine interest.',
          practical: false
        },
        {
          title: 'Handle the check gracefully',
          content: 'Offer to split it. If they insist on paying, let them. If you asked them out, be prepared to pay. Don\'t make it weird.',
          practical: true
        }
      ]
    },
    {
      id: 'red-flags',
      title: 'Red Flags to Watch',
      icon: Shield,
      color: 'bg-red-500',
      tips: [
        {
          title: 'Communication red flags',
          content: 'Love bombing (too intense too fast), only talking about themselves, getting angry when you don\'t respond immediately, or pushing for personal info too quickly.',
          practical: true
        },
        {
          title: 'Profile red flags',
          content: 'No clear face photos, all group photos, or profiles that seem too good to be true. Also watch out for people who seem bitter about dating in their bio.',
          practical: true
        },
        {
          title: 'First date red flags',
          content: 'Showing up late without notice, being rude to servers, talking about exes extensively, or making you uncomfortable when you set boundaries.',
          practical: true
        }
      ]
    },
    {
      id: 'mindset',
      title: 'Dating Mindset',
      icon: Lightbulb,
      color: 'bg-yellow-500',
      tips: [
        {
          title: 'Manage expectations',
          content: 'Not every match will lead to a relationship, and that\'s normal. Focus on meeting interesting people rather than finding "the one" immediately.',
          practical: false
        },
        {
          title: 'Take breaks when needed',
          content: 'Dating app fatigue is real. If you find yourself swiping mindlessly or getting discouraged, take a week off. You\'ll come back with fresh energy.',
          practical: true
        },
        {
          title: 'Be yourself (actually)',
          content: 'Don\'t pretend to like hiking if you hate it. The right person will appreciate your genuine interests, even if they\'re not conventionally "impressive."',
          practical: false
        }
      ]
    },
    {
      id: 'safety',
      title: 'Stay Safe',
      icon: Shield,
      color: 'bg-orange-500',
      tips: [
        {
          title: 'Meeting in public',
          content: 'Always meet in public places for first dates. Tell a friend where you\'re going and when you expect to be back. Trust your gut if something feels off.',
          practical: true
        },
        {
          title: 'Protect your privacy',
          content: 'Don\'t share your home address, workplace details, or last name until you\'ve met and feel comfortable. Use the app\'s messaging system initially.',
          practical: true
        },
        {
          title: 'Video chat first',
          content: 'If you\'ve been messaging for a while, suggest a quick video call before meeting. It helps verify they\'re who they say they are and can prevent awkward mismatches.',
          practical: true
        }
      ]
    }
  ];

  const appSpecificTips = [
    'Use your Memory Vault to remember important details about people you connect with',
    'Save conversation starters that worked well for future reference',
    'Note patterns in what types of people you connect with best',
    'Keep track of first date locations that worked out well'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Dating Tips That Actually Work</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real advice from real experiences. No fairy tale promises, just practical tips to help you have better dates and find genuine connections.
          </p>
        </header>

        {/* App-specific tips banner */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Make the Most of Your Memory Vault
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {appSpecificTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Tips grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tipCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.tips.map((tip, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <h4 className="font-medium text-sm flex-1">{tip.title}</h4>
                        {tip.practical && (
                          <Badge variant="secondary" className="text-xs">
                            Practical
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.content}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Remember</h3>
              <p className="text-sm text-muted-foreground">
                Dating is about finding someone who appreciates you for who you are. 
                These tips can help you present your best self, but the right person 
                will like you even on your awkward days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatingTips;