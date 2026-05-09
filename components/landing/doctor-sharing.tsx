'use client';

export function DoctorSharing() {
  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Patient View */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Your Complete Record</h3>
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <span className="text-sm font-medium text-foreground">Timeline Entries</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">24</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <span className="text-sm font-medium text-foreground">Doctors Shared With</span>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Data Encrypted</span>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Yes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <span className="text-2xl">↔️</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Same Timeline</p>
              <p className="text-xs text-muted-foreground">Different Permissions</p>
            </div>
          </div>

          {/* Right: Doctor View */}
          <div className="md:col-start-2">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Your Doctor's View</h3>
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <div className="space-y-4">
                <div className="pb-4 border-b border-border">
                  <p className="text-xs text-muted-foreground mb-2">Patient Shared</p>
                  <p className="text-sm font-semibold text-foreground">Complete Health Timeline</p>
                </div>
                <div className="pb-4 border-b border-border">
                  <p className="text-xs text-muted-foreground mb-2">Access Level</p>
                  <p className="text-sm font-semibold text-foreground">Full Historical Data</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Expires</p>
                  <p className="text-sm font-semibold text-foreground">Never (You Control)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-16 text-center">
          <p className="text-xl font-serif text-foreground italic">
            Same timeline. Different permissions. Complete control.
          </p>
        </div>
      </div>
    </section>
  );
}
