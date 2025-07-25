import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Question {
  id: number;
  Text: string;
}

const Questions = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchQuestions();
    }
  }, [user, loading, navigate]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        setQuestions(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingQuestions(false);
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
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
                  <p className="text-lg mb-4">{question.Text}</p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Your answer here...
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {questions.length > 0 && (
          <div className="mt-8 text-center">
            <Button size="lg">
              Submit Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;