'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress';
import { WelcomeStep } from '@/components/onboarding/welcome-step';
import { VoiceSetupStep } from '@/components/onboarding/voice-setup-step';
import { BasicInfoStep, type BasicInfoData } from '@/components/onboarding/basic-info-step';
import { WalletSetupStep } from '@/components/onboarding/wallet-setup-step';
import { useAuth } from '@/context/auth-context';

const STEPS = ['Welcome', 'Voice Setup', 'Your Info', 'Security'];

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfoData | null>(null);

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const handleBasicInfoSubmit = (data: BasicInfoData) => {
    setBasicInfo(data);
    handleNextStep();
  };

  const handleCompleteOnboarding = async () => {
    if (basicInfo) {
      await updateProfile({
        name: basicInfo.fullName,
        email: basicInfo.email,
        dateOfBirth: basicInfo.dateOfBirth,
        medicalConditions: basicInfo.medicalConditions.split(',').map(c => c.trim()),
        emergencyContact: basicInfo.emergencyContact,
        emergencyPhone: basicInfo.emergencyPhone,
      });
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            VoxHealth
          </h1>
          <p className="text-secondary">
            Set up your account in {STEPS.length} easy steps
          </p>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <OnboardingProgress
            currentStep={currentStep}
            totalSteps={STEPS.length}
            stepLabels={STEPS}
          />
        </div>

        {/* Step Content */}
        <Card className="p-8 border-0 shadow-lg">
          {currentStep === 1 && (
            <WelcomeStep onNext={handleNextStep} />
          )}

          {currentStep === 2 && (
            <VoiceSetupStep onNext={handleNextStep} />
          )}

          {currentStep === 3 && (
            <BasicInfoStep onNext={handleBasicInfoSubmit} />
          )}

          {currentStep === 4 && (
            <WalletSetupStep
              onNext={handleCompleteOnboarding}
              onSkip={handleCompleteOnboarding}
            />
          )}
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Your data is encrypted and HIPAA compliant.{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
