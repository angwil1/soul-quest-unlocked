import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Phone, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessibilityStatement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Accessibility Statement</h1>
            <p className="text-xl text-muted-foreground">
              AI Complete Me is committed to ensuring digital accessibility for people with disabilities
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Our Commitment</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-4">
              <p>
                AI Complete Me is committed to ensuring that our platform is accessible to all users, 
                regardless of ability or technology. We strive to meet or exceed the Web Content 
                Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>
              
              <p>
                We believe that connection and love should be accessible to everyone. Our accessibility 
                efforts are ongoing, and we continuously work to improve the user experience for all 
                members of our community.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Visual Accessibility</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• High contrast color schemes</li>
                    <li>• Scalable fonts and responsive design</li>
                    <li>• Alternative text for images</li>
                    <li>• Clear visual hierarchy and focus indicators</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Navigation & Interaction</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Keyboard navigation support</li>
                    <li>• Skip links for main content</li>
                    <li>• Consistent navigation patterns</li>
                    <li>• Screen reader compatible markup</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Content & Communication</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Clear, simple language</li>
                    <li>• Descriptive headings and labels</li>
                    <li>• Error identification and suggestions</li>
                    <li>• Adjustable time limits</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Inclusive Design</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Diverse representation in imagery</li>
                    <li>• Inclusive language and terminology</li>
                    <li>• Multiple ways to complete tasks</li>
                    <li>• Customizable user preferences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Standards Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                AI Complete Me aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 
                Level AA. These guidelines explain how to make web content more accessible for people 
                with disabilities, and user friendly for everyone.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Technical Standards</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• WCAG 2.1 Level AA compliance</li>
                  <li>• Section 508 standards adherence</li>
                  <li>• ARIA (Accessible Rich Internet Applications) implementation</li>
                  <li>• Semantic HTML structure</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ongoing Efforts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Accessibility is an ongoing process, and we are continuously working to improve. Our efforts include:
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Regular Audits</h4>
                  <p className="text-xs text-muted-foreground">
                    Automated and manual accessibility testing across all features
                  </p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">User Testing</h4>
                  <p className="text-xs text-muted-foreground">
                    Testing with users who have disabilities to identify real-world barriers
                  </p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Team Training</h4>
                  <p className="text-xs text-muted-foreground">
                    Regular accessibility training for our development and design teams
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We welcome your feedback on the accessibility of AI Complete Me. If you encounter 
                accessibility barriers or have suggestions for improvement, please let us know.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Email Support</p>
                    <p className="text-xs text-muted-foreground">accessibility@aicomplete.me</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">In-App Feedback</p>
                    <p className="text-xs text-muted-foreground">Use our feedback form</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Phone Support</p>
                    <p className="text-xs text-muted-foreground">Available upon request</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Response Commitment</h4>
                <p className="text-sm text-muted-foreground">
                  We aim to respond to accessibility feedback within 2 business days and work 
                  toward resolving issues as quickly as possible. For urgent accessibility needs, 
                  please indicate this in your communication.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For additional information about accessibility, we recommend these resources:
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Web Content Accessibility Guidelines (WCAG) 2.1</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">WebAIM (Web Accessibility in Mind)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">National Federation of the Blind</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Disability Rights Education & Defense Fund</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p className="mt-2">
              This statement reflects our ongoing commitment to accessibility and will be updated 
              as we continue to improve our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityStatement;