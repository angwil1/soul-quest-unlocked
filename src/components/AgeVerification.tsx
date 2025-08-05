import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CalendarDays, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";

export const AgeVerification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkAgeVerification();
    }
  }, [user]);

  const checkAgeVerification = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('age_verifications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Age verification check error:', error);
        return;
      }

      if (data) {
        setVerification(data);
        setIsVerified(data.is_verified);
      }
    } catch (error) {
      console.error('Age verification check error:', error);
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleVerifyAge = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to verify your age",
        variant: "destructive"
      });
      return;
    }

    if (!dateOfBirth) {
      toast({
        title: "Date Required",
        description: "Please enter your date of birth",
        variant: "destructive"
      });
      return;
    }

    const age = calculateAge(dateOfBirth);
    if (age < 18) {
      toast({
        title: "Age Requirement Not Met",
        description: "You must be 18 or older to use this platform",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('age_verifications')
        .upsert({
          user_id: user.id,
          date_of_birth: dateOfBirth,
          is_verified: true,
          verification_method: 'self_reported',
          verified_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Age Verified Successfully",
        description: "Your age has been verified. You can now access all features.",
        variant: "default"
      });

      setIsVerified(true);
      setIsOpen(false);
      await checkAgeVerification();
    } catch (error) {
      console.error('Age verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Unable to verify age. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = () => {
    if (isVerified) {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Age Verified
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Age Not Verified
        </Badge>
      );
    }
  };

  if (isVerified) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-200">
                Age Verified
              </span>
            </div>
            {getVerificationStatus()}
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">
            Your age has been verified. You have access to all platform features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <CalendarDays className="h-5 w-5" />
          Age Verification Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-yellow-700 dark:text-yellow-300">
            Verify your age to access all features
          </span>
          {getVerificationStatus()}
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              Verify Age
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Age Verification
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You must be 18 or older to use this platform. Your date of birth is used only for age verification and is kept private.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date(Date.now() - 567648000000).toISOString().split('T')[0]} // 18 years ago
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleVerifyAge}
                  disabled={loading || !dateOfBirth}
                  className="flex-1"
                >
                  {loading ? "Verifying..." : "Verify Age"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};