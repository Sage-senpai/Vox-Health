export function TrustStrip() {
  const trustItems = [
    { label: 'Encrypted on your Ledger', icon: '🔐' },
    { label: 'Stored on Solana', icon: '⛓️' },
    { label: 'HIPAA-aligned by design', icon: '✓' },
  ];

  return (
    <div className="bg-vellum border-t border-rule py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="space-y-4">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-ink-muted"
            >
              {/* Indigo dot */}
              <div className="w-2 h-2 rounded-full bg-indigo flex-shrink-0" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-subtle mt-6 font-medium">
          Powered by Solana, ElevenLabs, and Ledger.
        </p>
      </div>
    </div>
  );
}
