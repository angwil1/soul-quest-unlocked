import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import alexProfile from '@/assets/alex-profile-main.jpg';
import jordanProfile from '@/assets/jordan-profile-main.jpg';
import caseyProfile from '@/assets/casey-profile.jpg';
import riverProfile from '@/assets/river-profile-1.jpg';
import sageProfile from '@/assets/sage-profile-1.jpg';
import phoenixProfile from '@/assets/phoenix-profile-1.jpg';
import devProfile from '@/assets/dev-profile-main.jpg';
import marcusProfile from '@/assets/marcus-profile-main.jpg';

interface ProfilePreview {
  id: string;
  name: string;
  age: number;
  location: string;
  vibeTag: string;
  image: string;
  bio: string;
}

const profilePreviews: ProfilePreview[] = [
  {
    id: "sample-1",
    name: "Alex",
    age: 28,
    location: "Portland, OR",
    vibeTag: "Adventurous",
    image: alexProfile,
    bio: "Love exploring new places and trying different cuisines."
  },
  {
    id: "sample-7",
    name: "Dev",
    age: 28,
    location: "San Francisco, CA",
    vibeTag: "Cultural Bridge",
    image: devProfile,
    bio: "Software engineer who loves cricket and cooking traditional recipes."
  },
  {
    id: "sample-2",
    name: "Jordan",
    age: 25,
    location: "Austin, TX",
    vibeTag: "Creative",
    image: jordanProfile,
    bio: "Artist and coffee enthusiast. Always up for deep conversations."
  },
  {
    id: "sample-8",
    name: "Marcus",
    age: 31,
    location: "New Orleans, LA",
    vibeTag: "Soulful Connector",
    image: marcusProfile,
    bio: "Jazz musician who believes in the power of rhythm to bring people together."
  },
  {
    id: "sample-3",
    name: "Casey",
    age: 30,
    location: "San Diego, CA",
    vibeTag: "Nature Lover",
    image: caseyProfile,
    bio: "Marine biologist who loves the ocean and environmental conservation."
  },
  {
    id: "sample-4",
    name: "River",
    age: 27,
    location: "Boulder, CO",
    vibeTag: "Mindful",
    image: riverProfile,
    bio: "Yoga instructor and mindfulness coach."
  }
];

export const CommunityPreview = () => {
  const navigate = useNavigate();

  const handleViewProfile = (profileId: string) => {
    navigate(`/sample-profile/${profileId}`);
  };

  const handleBrowseAll = () => {
    navigate('/browse-profiles');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-4">
            Meet our community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover authentic connections with people who share your values and vision for meaningful relationships
          </p>
          <Button 
            onClick={handleBrowseAll}
            variant="outline" 
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Browse All Profiles
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profilePreviews.map((profile) => (
            <Card 
              key={profile.id}
              className="overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => handleViewProfile(profile.id)}
            >
              <div className="relative">
                <img
                  src={profile.image}
                  alt={`${profile.name}'s profile`}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    {profile.vibeTag}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-foreground">
                    {profile.name}, {profile.age}
                  </h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  📍 {profile.location}
                </p>
                
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {profile.bio}
                </p>
                
                <div className="mt-4 pt-4 border-t border-border/50">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProfile(profile.id);
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Ready to join this amazing community?
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 py-3 text-lg"
          >
            Create Your Profile
          </Button>
        </div>
      </div>
    </section>
  );
};