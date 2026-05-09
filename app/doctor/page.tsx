import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, Search, Eye, FileText } from 'lucide-react';

export default function DoctorPortalPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center space-y-3">
          <h1 className="text-4xl font-serif font-bold text-foreground">
            Doctor Portal
          </h1>
          <p className="text-lg text-secondary">
            Access your patient&apos;s medical records securely
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code Scanner */}
          <Card className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-background rounded-lg border-2 border-primary border-dashed flex items-center justify-center">
                <QrCode className="w-16 h-16 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                Scan QR Code
              </h2>
              <p className="text-secondary mb-6">
                Ask your patient to share their access QR code
              </p>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12">
                Scan QR Code
              </Button>
            </div>
          </Card>

          {/* Manual Patient Search */}
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                Search Patient
              </h2>
              <p className="text-secondary mb-6">
                Or enter a patient ID to access their records
              </p>
            </div>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Enter Patient ID"
                className="h-12"
              />
              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 gap-2">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Patients */}
        <div className="mt-12">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            Recent Patients
          </h2>
          <div className="grid gap-4">
            {[
              { name: 'Margaret Chen', id: 'PAT-001', lastAccess: '2 hours ago' },
              { name: 'Robert Williams', id: 'PAT-002', lastAccess: '1 day ago' },
            ].map((patient, i) => (
              <Card key={i} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{patient.name}</h3>
                  <p className="text-sm text-secondary">ID: {patient.id}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last accessed {patient.lastAccess}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />
                    <span className="hidden md:inline">View Records</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden md:inline">Report</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <Card className="mt-12 p-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">
            🔒 Secure Access
          </h3>
          <p className="text-secondary text-sm">
            All patient records are encrypted and access is logged. You can only view records that patients have explicitly granted access to.
          </p>
        </Card>
      </div>
    </div>
  );
}
