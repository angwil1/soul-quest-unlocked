import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AlertTriangle, Shield } from "lucide-react";
import { reportSchema, sanitizeForStorage } from "@/lib/validation";

interface ReportUserProps {
  reportedUserId: string;
  reportedUserName?: string;
}

export const ReportUser = ({ reportedUserId, reportedUserName }: ReportUserProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  const reportReasons = [
    { value: "inappropriate_content", label: "Inappropriate Content" },
    { value: "harassment", label: "Harassment or Bullying" },
    { value: "spam", label: "Spam or Scam" },
    { value: "fake_profile", label: "Fake Profile" },
    { value: "underage", label: "Appears to be Underage" },
    { value: "safety_concern", label: "Safety Concern" },
    { value: "other", label: "Other" }
  ];

  const validateReport = () => {
    try {
      reportSchema.parse({ 
        reason, 
        description: description.trim() || undefined 
      });
      setValidationError('');
      return true;
    } catch (error: any) {
      const errorMessage = error.issues?.[0]?.message || 'Invalid report data';
      setValidationError(errorMessage);
      return false;
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setValidationError('');
  };

  const handleSubmitReport = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to report users",
        variant: "destructive"
      });
      return;
    }

    if (!validateReport()) {
      toast({
        title: "Validation Error",
        description: validationError || "Please check your report details",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Sanitize the description before storing
      const sanitizedDescription = description.trim() ? sanitizeForStorage(description) : null;
      
      const { error } = await supabase
        .from('user_reports')
        .insert({
          reporter_id: user.id,
          reported_user_id: reportedUserId,
          reason: reason as any,
          description: sanitizedDescription
        });

      if (error) throw error;

      // Log the security event
      await supabase.rpc('log_security_event', {
        p_event_type: 'user_report_submitted',
        p_event_data: {
          reported_user_id: reportedUserId,
          reason: reason,
          has_description: !!sanitizedDescription
        }
      });

      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep our community safe. We'll review this report promptly.",
        variant: "default"
      });

      setIsOpen(false);
      setReason("");
      setDescription("");
      setValidationError('');
    } catch (error) {
      console.error('Report submission error:', error);
      toast({
        title: "Report Failed",
        description: "Unable to submit report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:border-red-200">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Report {reportedUserName || "User"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Report *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className={validationError && !reason ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Details (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide additional context about this report..."
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              maxLength={1000}
              rows={3}
              className={validationError && description ? 'border-red-500' : ''}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {description.length}/1000 characters
              </p>
              {validationError && (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <AlertTriangle className="h-3 w-3" />
                  {validationError}
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Important:</strong> Reports are reviewed by our safety team. False reports may result in account restrictions.
              All reports are logged for security purposes.
            </p>
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
              onClick={handleSubmitReport}
              disabled={loading || !reason}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};