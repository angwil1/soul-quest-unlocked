import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { Heart, X } from "lucide-react";

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onComplete()}>
      <DialogContent 
        className="sm:max-w-sm rounded-lg shadow-md border bg-background" 
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-6 w-6 rounded-full"
          onClick={onComplete}
        >
          <X className="h-3 w-3" />
        </Button>

        <DialogHeader className="text-center space-y-2 pb-3">
          <DialogTitle className="text-base font-semibold text-foreground leading-tight">
            Welcome to AI Complete Me
          </DialogTitle>
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs">
              Help us find your matches
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-primary font-medium mb-1">
                🎁 Quiet Start Gift
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                As part of our Quiet Start, you'll receive a keepsake of care. We'll ask for your shipping info after signup.
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-3 py-2">
          {/* Gender Selection */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-foreground">I am</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full h-8 rounded-md border border-border text-xs">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
                <SelectItem value="man">Man</SelectItem>
                <SelectItem value="woman">Woman</SelectItem>
                <SelectItem value="nonbinary">Nonbinary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Looking For Selection */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-foreground">Looking for</Label>
            <Select value={lookingFor} onValueChange={setLookingFor}>
              <SelectTrigger className="w-full h-8 rounded-md border border-border text-xs">
                <SelectValue placeholder="Looking for" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
                <SelectItem value="woman">Woman</SelectItem>
                <SelectItem value="man">Man</SelectItem>
                <SelectItem value="nonbinary">Nonbinary</SelectItem>
                <SelectItem value="anyone">Anyone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Range Preference */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-foreground">
              Age: {ageRange[0]}-{ageRange[1]}
            </Label>
            <Slider
              value={ageRange}
              onValueChange={setAgeRange}
              min={18}
              max={80}
              step={1}
              className="w-full"
            />
          </div>

          {/* Location */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-foreground">Location</Label>
            <Input
              type="text"
              placeholder="Zip or city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-8 rounded-md border border-border text-xs"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              onClick={handleComplete}
              disabled={!isComplete || loading}
              className="w-full h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium rounded-md"
            >
              {loading ? "Setting up..." : "Start Matching"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};