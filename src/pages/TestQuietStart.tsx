import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShippingProgressTracker } from '@/components/ShippingProgressTracker';
import { useShippingEligibility } from '@/hooks/useShippingEligibility';
import { useQuietStartProgress } from '@/hooks/useQuietStartProgress';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TestQuietStart = () => {
  const navigate = useNavigate();
  const { eligibility, isLoading: eligibilityLoading } = useShippingEligibility();
  const { claimedCount, isLoading: progressLoading } = useQuietStartProgress();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiet Start Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Progress Stats</h3>
                  <p>Total Claimed Kits: {progressLoading ? 'Loading...' : claimedCount}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">User Eligibility</h3>
                  {eligibilityLoading ? (
                    <p>Loading eligibility...</p>
                  ) : eligibility ? (
                    <div className="space-y-2">
                      <p>Eligible: {eligibility.eligible ? 'Yes' : 'No'}</p>
                      <p>Status: {eligibility.shipping_status || 'N/A'}</p>
                      {eligibility.days_remaining && (
                        <p>Days Remaining: {eligibility.days_remaining}</p>
                      )}
                      {eligibility.reason && (
                        <p>Reason: {eligibility.reason}</p>
                      )}
                    </div>
                  ) : (
                    <p>No eligibility data found</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Progress Tracker Component</CardTitle>
            </CardHeader>
            <CardContent>
              <ShippingProgressTracker />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestQuietStart;