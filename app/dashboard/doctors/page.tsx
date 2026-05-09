import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Eye, Copy } from 'lucide-react';

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-1">
            Doctor Access
          </h1>
          <p className="text-secondary">
            Manage who can view your medical records
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
          <Plus className="w-4 h-4" />
          <span>Grant Access</span>
        </Button>
      </div>

      {/* QR Code Section */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 text-center">
        <div className="space-y-4 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-foreground">Share via QR Code</h3>
          <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-primary">
            <div className="text-center">
              <p className="text-sm text-secondary">QR Code Generator</p>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>
          </div>
          <p className="text-sm text-secondary">
            Doctors can scan this code to request access to your medical records
          </p>
          <Button variant="outline" className="w-full gap-2">
            <Copy className="w-4 h-4" />
            <span>Generate & Copy Link</span>
          </Button>
        </div>
      </Card>

      {/* Granted Access */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Granted Access</h3>
        {[
          { name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', since: 'Oct 2024', expires: 'Jan 2025' },
          { name: 'Dr. Michael Chen', specialty: 'Primary Care', since: 'Dec 2024', expires: 'Mar 2025' },
        ].map((doctor, i) => (
          <Card key={i} className="p-6 border-border">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground">{doctor.name}</h4>
                <p className="text-sm text-secondary mb-2">{doctor.specialty}</p>
                <p className="text-xs text-muted-foreground">
                  Access since {doctor.since} • Expires {doctor.expires}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye className="w-4 h-4" />
                  <span className="hidden md:inline">View</span>
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive gap-1">
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden md:inline">Revoke</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {false && (
        <Card className="p-8 text-center border-dashed border-border">
          <p className="text-secondary mb-4">No doctors have access yet</p>
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
            <Plus className="w-4 h-4" />
            <span>Share Your Records</span>
          </Button>
        </Card>
      )}
    </div>
  );
}
