import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

interface ProfileSetupModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onComplete }) => {
  const [gender, setGender] = useState<string>("");
  const [lookingFor, setLookingFor] = useState<string>("");
  const [ageRange, setAgeRange] = useState<number[]>([18, 35]);
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  const { updateProfile } = useProfile();
  const navigate = useNavigate();

  const handleComplete = async () => {
    if (!gender || !lookingFor || !location) {
      return;
    }

    setLoading(true);
    
    try {
      await updateProfile({
        gender,
        looking_for: lookingFor,
        age_preference_min: ageRange[0],
        age_preference_max: ageRange[1],
        location,
      });
      
      onComplete();
      navigate("/matches");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const isComplete = gender && lookingFor && location;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md rounded-xl shadow-lg border-0 bg-background/95 backdrop-blur-sm" 
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center space-y-2 pb-2">
          <div className="flex justify-center">
            <div className="p-2 rounded-full bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground leading-tight">
            Let's get you started—who are you hoping to meet?
          </DialogTitle>
          <p className="text-muted-foreground text-xs">
            Just a few quick details to find your perfect connections
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-3 px-1">
          {/* Gender Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-foreground">I am a...</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full h-9 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="man" className="rounded-md">Man</SelectItem>
                <SelectItem value="woman" className="rounded-md">Woman</SelectItem>
                <SelectItem value="nonbinary" className="rounded-md">Nonbinary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Looking For Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-foreground">Looking for a...</Label>
            <Select value={lookingFor} onValueChange={setLookingFor}>
              <SelectTrigger className="w-full h-9 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Who are you looking for?" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="woman" className="rounded-md">Woman</SelectItem>
                <SelectItem value="man" className="rounded-md">Man</SelectItem>
                <SelectItem value="nonbinary" className="rounded-md">Nonbinary</SelectItem>
                <SelectItem value="anyone" className="rounded-md">Open to anyone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Range Preference */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-foreground">
              Age Range: {ageRange[0]} - {ageRange[1]} years old
            </Label>
            <div className="px-1">
              <Slider
                value={ageRange}
                onValueChange={setAgeRange}
                min={18}
                max={80}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-foreground">Location</Label>
            <Input
              type="text"
              placeholder="Enter your zip code or city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-9 rounded-lg border border-border hover:border-primary/50 focus:border-primary transition-colors"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              onClick={handleComplete}
              disabled={!isComplete || loading}
              className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                  Setting up...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Heart className="h-3 w-3" />
                  Begin Your Echo
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};