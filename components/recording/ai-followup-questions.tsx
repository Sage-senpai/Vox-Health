'use client';

import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface AIFollowupQuestionsProps {
  questions: string[];
  onAnswerClick: (question: string) => void;
  isLoading?: boolean;
}

const defaultQuestions = [
  'What is your pain level? (1-10)',
  'When did this start?',
  'Any other symptoms?',
  'Have you taken medication?',
];

export function AIFollowupQuestions({
  questions = defaultQuestions,
  onAnswerClick,
  isLoading = false,
}: AIFollowupQuestionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">
          Answer a question to help us understand better
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {questions.map((question, i) => (
          <Button
            key={i}
            onClick={() => onAnswerClick(question)}
            variant="outline"
            disabled={isLoading}
            className="justify-start text-left h-auto py-3 px-4"
          >
            <span className="text-sm">{question}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
