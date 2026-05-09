'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, Bell, BellOff } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  adherence: number;
}

const initialMeds: Medication[] = [
  { id: 'lisinopril', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', adherence: 95 },
  { id: 'metformin', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', adherence: 98 },
  { id: 'atorvastatin', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', adherence: 90 },
];

export default function MedicationsPage() {
  const [meds] = useState<Medication[]>(initialMeds);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const onAdd = () => {
    toast.message('Add medication', {
      description: 'Medication editor coming soon — for the demo we ship with three preset meds.',
    });
  };

  const onEdit = (med: Medication) => {
    toast.message(`Edit ${med.name}`, {
      description: 'Medication editor coming soon.',
    });
  };

  const onToggleReminders = () => {
    setRemindersEnabled((r) => {
      const next = !r;
      toast.success(next ? 'Reminders enabled' : 'Reminders disabled');
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-1">
            Your Medications
          </h1>
          <p className="text-ink-muted">
            Track your prescriptions and adherence
          </p>
        </div>
        <Button onClick={onAdd} className="bg-primary hover:bg-primary/90 text-white gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Medication</span>
        </Button>
      </div>

      {/* Active Medications */}
      <div className="space-y-4">
        {meds.map((med) => (
          <Card key={med.id} className="p-6 border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{med.name}</h3>
                <p className="text-sm text-ink-muted">{med.dosage}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-serif font-bold text-accent">{med.adherence}%</p>
                <p className="text-xs text-muted-foreground">Adherence</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-sm text-ink-muted">{med.frequency}</p>
              <Button onClick={() => onEdit(med)} variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Reminder Settings */}
      <Card className="p-6 bg-background border-border">
        <div className="flex gap-4">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">Medication Reminders</h3>
            <p className="text-sm text-ink-muted mb-4">
              Enable notifications to help you stay on schedule with your medications.
              Currently {remindersEnabled ? 'enabled' : 'disabled'}.
            </p>
            <Button onClick={onToggleReminders} variant="outline" size="sm" className="gap-2">
              {remindersEnabled ? (
                <>
                  <BellOff className="w-4 h-4" />
                  <span>Disable Reminders</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Enable Reminders</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
