'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BasicInfoStepProps {
  onNext: (data: BasicInfoData) => void;
}

export interface BasicInfoData {
  fullName: string;
  email: string;
  dateOfBirth: string;
  medicalConditions: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export function BasicInfoStep({ onNext }: BasicInfoStepProps) {
  const [formData, setFormData] = useState<BasicInfoData>({
    fullName: '',
    email: '',
    dateOfBirth: '',
    medicalConditions: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.dateOfBirth) {
      onNext(formData);
    }
  };

  const isComplete =
    formData.fullName && formData.email && formData.dateOfBirth;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold text-foreground">
          Tell Us About You
        </h2>
        <p className="text-secondary">
          This helps us personalize your health journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Full Name *
          </label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Smith"
            className="h-11"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Email Address *
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="h-11"
            required
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Date of Birth *
          </label>
          <Input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="h-11"
            required
          />
        </div>

        {/* Medical Conditions */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Medical Conditions
          </label>
          <textarea
            name="medicalConditions"
            value={formData.medicalConditions}
            onChange={handleChange}
            placeholder="e.g., Type 2 Diabetes, High Blood Pressure"
            className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated or one per line
          </p>
        </div>

        {/* Emergency Contact */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Emergency Contact
            </label>
            <Input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Phone Number
            </label>
            <Input
              type="tel"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              className="h-11"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isComplete}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-white text-base h-12"
        >
          Continue
        </Button>
      </form>
    </div>
  );
}
