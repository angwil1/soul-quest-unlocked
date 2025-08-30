import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    location: "San Francisco, CA",
    image: "/lovable-uploads/ca0ac62b-2f4a-43d8-aafa-8a00c169e4b7.png",
    quote: "I was skeptical about dating apps, but this felt different. Within weeks, I found someone who truly understood me. We're planning our wedding next spring.",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Johnson",
    location: "Austin, TX", 
    image: "/lovable-uploads/4d9dd872-6dba-4924-b50f-ebea68fb0e0e.png",
    quote: "The AI matching was incredible. Instead of endless swiping, I had meaningful conversations from day one. Found my soulmate after just 3 dates.",
    rating: 5
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    location: "Miami, FL",
    image: "/lovable-uploads/fff4c684-28bc-468f-8bc0-481d0ced042a.png",
    quote: "Finally, an app that focuses on compatibility over superficial attraction. The emotional intelligence matching changed everything for me.",
    rating: 5
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 mb-6">
            <Star className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Real Stories</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Love Stories in Beta
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Even in our early testing phase, meaningful connections are already happening.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="p-6 bg-gradient-to-br from-background to-muted/5 border-primary/10 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <div className="relative mb-6">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                <p className="text-muted-foreground italic leading-relaxed pl-6">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-medium">
              *Beta testing results
            </span>
            {" "}• Privacy-first approach • Real people, real connections
          </p>
        </div>
      </div>
    </section>
  );
};