'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWallet } from '@/context/wallet-context';
import { useHealthAgent } from '@/hooks/use-health-agent';

interface WalletSetupStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export function WalletSetupStep({ onNext, onSkip }: WalletSetupStepProps) {
  const { connect, isConnected, isLoading, publicKey, hasLiveSigner, environment } = useWallet();
  const { agent } = useHealthAgent({ patientPubkey: publicKey ?? undefined });
  const [hasAttempted, setHasAttempted] = useState(false);
  const [initStatus, setInitStatus] = useState<'idle' | 'pending' | 'done' | 'error'>('idle');
  const [initDetail, setInitDetail] = useState<string>('');

  const handleConnect = async () => {
    setHasAttempted(true);
    await connect();
    // Once connected, ask the agent to create the on-chain Patient PDA. This
    // is idempotent — if the PDA already exists the tool short-circuits.
    if (publicKey) {
      setInitStatus('pending');
      try {
        const result = await agent.call<{ txSignature: string; patientPda: string; source: string }>(
          'solana.initializePatient',
          { ledgerPubkey: publicKey },
        );
        setInitDetail(`${result.source} · ${result.patientPda.slice(0, 8)}…${result.patientPda.slice(-4)}`);
        setInitStatus('done');
      } catch (err) {
        setInitDetail(err instanceof Error ? err.message : String(err));
        setInitStatus('error');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold text-foreground">
          Secure Your Medical Data
        </h2>
        <p className="text-secondary">
          Connect your Solana wallet to encrypt and secure your health records.
        </p>
      </div>

      {/* Explanation Card */}
      <div className="p-6 bg-background rounded-lg border border-border space-y-4">
        <h3 className="font-semibold text-foreground">What is a Solana Wallet?</h3>
        <p className="text-sm text-secondary leading-relaxed">
          A Solana wallet is your secure digital identity. It lets you control access to your medical records 
          and grant permissions to doctors. Think of it as a secure vault for your health data that only you 
          can unlock.
        </p>

        <div className="space-y-3">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-secondary">
              <span className="font-semibold text-foreground">Private & Secure:</span> Your keys stay with you
            </p>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-secondary">
              <span className="font-semibold text-foreground">Control Access:</span> Grant and revoke doctor access anytime
            </p>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-secondary">
              <span className="font-semibold text-foreground">Transparent:</span> No hidden fees or tracking
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Options */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Choose your wallet:</p>
        
        <button className="w-full p-4 border border-border rounded-lg hover:border-primary hover:bg-background transition-colors text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Phantom Wallet</p>
              <p className="text-xs text-secondary">Browser extension (recommended)</p>
            </div>
          </div>
        </button>

        <button className="w-full p-4 border border-border rounded-lg hover:border-primary hover:bg-background transition-colors text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Ledger Hardware Wallet</p>
              <p className="text-xs text-secondary">Maximum security</p>
            </div>
          </div>
        </button>
      </div>

      {/* Connection Status */}
      {hasAttempted && (
        <div
          className={`p-4 rounded-lg border ${
            isConnected
              ? 'bg-accent/10 border-accent'
              : 'bg-destructive/10 border-destructive'
          }`}
        >
          <div className="flex gap-3 items-start">
            {isConnected ? (
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-2">
              <p className={`font-semibold ${isConnected ? 'text-accent' : 'text-destructive'}`}>
                {isConnected ? 'Wallet Connected Successfully' : 'Wallet Connection Failed'}
              </p>
              {isConnected && (
                <ul className="text-xs text-secondary space-y-1 font-mono">
                  <li>environment · {environment}</li>
                  <li>signer · {hasLiveSigner ? 'live' : 'mock'}</li>
                  {publicKey && <li>pubkey · {publicKey.slice(0, 8)}…{publicKey.slice(-4)}</li>}
                  {initStatus !== 'idle' && (
                    <li>
                      patient PDA · {initStatus === 'pending' ? 'initializing…' : initDetail || initStatus}
                    </li>
                  )}
                </ul>
              )}
              {!isConnected && (
                <p className="text-sm text-secondary">
                  Install Phantom (desktop) or open VoxHealth in the Solana Mobile dApp Store browser.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleConnect}
          disabled={isLoading || isConnected}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-white text-base h-12"
        >
          {isLoading
            ? 'Connecting...'
            : isConnected
              ? 'Wallet Connected'
              : 'Connect Wallet'}
        </Button>

        <Button
          onClick={onSkip}
          variant="outline"
          size="lg"
          className="w-full text-base h-12"
        >
          Skip for Now
        </Button>
      </div>

      {/* Continue Button (only show after connected or skipped) */}
      {(isConnected || hasAttempted) && (
        <Button
          onClick={onNext}
          size="lg"
          className="w-full bg-accent hover:bg-accent/90 text-white text-base h-12"
        >
          Finish Onboarding
        </Button>
      )}
    </div>
  );
}
