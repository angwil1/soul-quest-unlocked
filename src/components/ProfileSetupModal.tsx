import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";

interface ProfileSetupModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onComplete }) => {
  const [gender, setGender] = useState<string>("");
  const [lookingFor, setLookingFor] = useState<string>("");
  const [ageRange, setAgeRange] = useState<number[]>([25, 45]);
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
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-foreground mb-2">
            Let's get you started—who are you hoping to meet?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Gender Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">I am a...</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="man">Man</SelectItem>
                <SelectItem value="woman">Woman</SelectItem>
                <SelectItem value="nonbinary">Nonbinary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Looking For Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Looking for a...</Label>
            <Select value={lookingFor} onValueChange={setLookingFor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Who are you looking for?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="woman">Woman</SelectItem>
                <SelectItem value="man">Man</SelectItem>
                <SelectItem value="nonbinary">Nonbinary</SelectItem>
                <SelectItem value="anyone">Open to anyone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Age Range: {ageRange[0]} - {ageRange[1]}
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
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Location</Label>
            <Input
              type="text"
              placeholder="Enter your zip code or city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleComplete}
            disabled={!isComplete || loading}
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? "Setting up..." : "See Matches"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};