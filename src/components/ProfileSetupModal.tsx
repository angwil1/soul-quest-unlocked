import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { format, differenceInYears } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSetupModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onComplete }) => {
  const [gender, setGender] = useState<string>("");
  const [lookingFor, setLookingFor] = useState<string>("");
  const [ageRange, setAgeRange] = useState<number[]>([18, 35]);
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  const { updateProfile } = useProfile();
  const navigate = useNavigate();

  const handleComplete = async () => {
    if (!gender || !lookingFor || !location || !dateOfBirth || !email) {
      return;
    }

    const userAge = differenceInYears(new Date(), dateOfBirth);
    if (userAge < 18) {
      alert("You must be 18 or older to use this app.");
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
        age: userAge,
        date_of_birth: format(dateOfBirth, 'yyyy-MM-dd'),
      });
      
      onComplete();
      navigate("/matches");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const isComplete = gender && lookingFor && location && dateOfBirth && email;
  const userAge = dateOfBirth ? differenceInYears(new Date(), dateOfBirth) : 0;

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

          {/* Date of Birth */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateOfBirth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick your date of birth</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={setDateOfBirth}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {dateOfBirth && userAge < 18 && (
              <p className="text-sm text-destructive">You must be 18 or older to use this app</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Email</Label>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Age Range Preference */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Age Range Preference: {ageRange[0]} - {ageRange[1]}
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