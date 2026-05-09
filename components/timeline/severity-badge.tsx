'use client';

import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SeverityBadgeProps {
  severity: number; // 1-10
  className?: string;
}

export function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  let bgColor = 'bg-green-100';
  let textColor = 'text-green-800';
  let Icon = CheckCircle2;
  let label = 'Mild';

  if (severity >= 7) {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
    Icon = AlertCircle;
    label = 'Severe';
  } else if (severity >= 5) {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
    Icon = AlertTriangle;
    label = 'Moderate';
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${bgColor} ${textColor} text-sm font-medium ${className}`}>
      <Icon className="w-4 h-4" />
      <span>{label} ({severity}/10)</span>
    </div>
  );
}
