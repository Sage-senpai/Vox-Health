'use client';

export function ProductShowcase() {
  return (
    <section className="w-full bg-gradient-to-b from-secondary to-secondary/80 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-secondary-foreground mb-16">
          A Timeline of Your Health, Not Theirs
        </h2>

        <div className="relative">
          {/* Glow effect around mockup */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent rounded-3xl blur-3xl -z-10 h-full" />

          {/* Product Mockup */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur">
            <div className="bg-secondary/5 p-6 md:p-12">
              {/* Mock Timeline Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-secondary/20">
                <h3 className="text-lg font-semibold text-foreground">Your Timeline</h3>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                </div>
              </div>

              {/* Timeline Entries */}
              <div className="space-y-6">
                {/* Entry 1 */}
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground mb-2">Morning Headache</p>
                    <p className="text-sm text-muted-foreground mb-3">Sharp pain in left temple, worse with light exposure</p>
                    <div className="flex gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary/10 rounded-full text-xs text-primary font-medium">Severity: 7/10</span>
                      <span className="px-3 py-1 bg-accent/10 rounded-full text-xs text-accent font-medium">Voice recorded</span>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                      <div className="w-1 h-3 bg-primary rounded-sm opacity-60" />
                      <div className="w-1 h-6 bg-primary rounded-sm opacity-80" />
                      <div className="w-1 h-4 bg-primary rounded-sm opacity-60" />
                      <div className="w-1 h-7 bg-primary rounded-sm" />
                      <div className="w-1 h-5 bg-primary rounded-sm opacity-70" />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>

                {/* Entry 2 */}
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-accent flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground mb-2">Medication Taken</p>
                    <p className="text-sm text-muted-foreground">Morning routine completed</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 bg-accent/10 rounded-full text-xs text-accent font-medium">Logged</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>

                {/* Entry 3 */}
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-destructive flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground mb-2">Doctor Visit Note</p>
                    <p className="text-sm text-muted-foreground">Dr. Chen reviewed timeline and voice notes</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 bg-destructive/10 rounded-full text-xs text-destructive font-medium">Shared</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Below mockup CTA */}
        <div className="text-center mt-12">
          <p className="text-secondary-foreground/80 text-sm">
            ✨ Beautiful, editorial design. Your health data deserves to look this good.
          </p>
        </div>
      </div>
    </section>
  );
}
