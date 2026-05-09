'use client';

import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function OnboardingProgress({
  currentStep,
  totalSteps,
  stepLabels,
}: OnboardingProgressProps) {
  return (
    <div className="w-full space-y-4">
      {/* Progress Bar */}
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {stepLabels.map((label, idx) => {
          const stepNum = idx + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  isComplete
                    ? 'bg-accent text-white'
                    : isCurrent
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              <span
                className={`text-xs text-center max-w-16 ${
                  isCurrent
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
