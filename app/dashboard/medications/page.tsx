import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';

export default function MedicationsPage() {
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
        <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Medication</span>
        </Button>
      </div>

      {/* Active Medications */}
      <div className="space-y-4">
        {[
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', adherence: 95 },
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', adherence: 98 },
          { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', adherence: 90 },
        ].map((med, i) => (
          <Card key={i} className="p-6 border-border">
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
              <Button variant="outline" size="sm">
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
          <div>
            <h3 className="font-semibold text-foreground mb-2">Medication Reminders</h3>
            <p className="text-sm text-ink-muted mb-4">
              Enable notifications to help you stay on schedule with your medications
            </p>
            <Button variant="outline" size="sm">
              Configure Reminders
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
