import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEmailJourneys } from '@/hooks/useEmailJourneys';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';

interface Question {
  id: number;
  Text: string;
  question_type: 'likert' | 'singleSelect';
  options?: string[];
}

const Questions = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { trackQuizCompletion } = useEmailJourneys();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Always fetch questions - allow both authenticated and unauthenticated access
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        const formattedQuestions = (data || []).map(q => ({
          ...q,
          question_type: q.question_type as 'likert' | 'singleSelect',
          options: Array.isArray(q.options) ? q.options as string[] : undefined
        }));
        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!user) {
      toast({
        title: "Demo Mode",
        description: "Quiz submitted successfully! In the real app, you'd sign in to save results.",
      });
      navigate('/quiz-results');
      return;
    }

    const answeredQuestions = Object.keys(answers).length;
    if (answeredQuestions < questions.length) {
      toast({
        title: "Please answer all questions",
        description: `You've answered ${answeredQuestions} out of ${questions.length} questions.`,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    try {
      // Track quiz completion for email journeys
      await trackQuizCompletion();

      toast({
        title: "Quiz completed! 🎉",
        description: "Your compatibility profile is being generated. You'll receive an email with your results!",
      });

      // Navigate to quiz results page
      navigate('/quiz-results');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error submitting quiz",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || loadingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl">Loading questions...</h2>
        </div>
      </div>
    );
  }

  // Allow unauthenticated access to view questions

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="p-4 pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={() => navigate('/')} variant="outline">
            ← Back to Dashboard
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Compatibility Quiz</h1>
          <p className="text-xl text-muted-foreground">
            Discover deeper connections through meaningful questions
          </p>
        </div>

        <div className="space-y-6">
          {questions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No questions available yet.</p>
              </CardContent>
            </Card>
          ) : (
            questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle>Question {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-6">{question.Text}</p>
                  <RadioGroup 
                    value={answers[question.id] || ""} 
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    {question.question_type === 'likert' ? (
                      // Likert scale options
                      <>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="strongly_disagree" id={`${question.id}_1`} />
                          <Label htmlFor={`${question.id}_1`}>Strongly Disagree</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="disagree" id={`${question.id}_2`} />
                          <Label htmlFor={`${question.id}_2`}>Disagree</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="neutral" id={`${question.id}_3`} />
                          <Label htmlFor={`${question.id}_3`}>Neutral</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="agree" id={`${question.id}_4`} />
                          <Label htmlFor={`${question.id}_4`}>Agree</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="strongly_agree" id={`${question.id}_5`} />
                          <Label htmlFor={`${question.id}_5`}>Strongly Agree</Label>
                        </div>
                      </>
                    ) : (
                      // Multiple choice options
                      question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option} 
                            id={`${question.id}_${optionIndex}`} 
                          />
                          <Label htmlFor={`${question.id}_${optionIndex}`}>
                            {option}
                          </Label>
                        </div>
                      ))
                    )}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {questions.length > 0 && (
          <div className="mt-8 text-center">
            <Button 
              size="lg" 
              onClick={handleSubmitQuiz}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Questions;