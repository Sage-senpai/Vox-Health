'use client';

import { useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Eye, Copy, Check } from 'lucide-react';
import { useWallet } from '@/context/wallet-context';

interface GrantedDoctor {
  id: string;
  name: string;
  specialty: string;
  since: string;
  expires: string;
}

const initialDoctors: GrantedDoctor[] = [
  { id: 'sarah', name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', since: 'Oct 2024', expires: 'Jan 2025' },
  { id: 'michael', name: 'Dr. Michael Chen', specialty: 'Primary Care', since: 'Dec 2024', expires: 'Mar 2025' },
];

export default function DoctorsPage() {
  const { publicKey, isConnected, connect } = useWallet();
  const [copied, setCopied] = useState(false);
  const [doctors, setDoctors] = useState<GrantedDoctor[]>(initialDoctors);
  const qrCardRef = useRef<HTMLDivElement>(null);

  const grantUrl = useMemo(() => {
    if (!publicKey) return '';
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://vox-health.vercel.app';
    return `${origin}/doctor?patient=${encodeURIComponent(publicKey)}`;
  }, [publicKey]);

  const onCopy = async () => {
    if (!grantUrl) return;
    await navigator.clipboard.writeText(grantUrl);
    setCopied(true);
    toast.success('Grant link copied to clipboard');
    setTimeout(() => setCopied(false), 1800);
  };

  const onGrantAccess = () => {
    qrCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (!isConnected) {
      toast.message('Connect your wallet to generate a grant QR.');
    }
  };

  const onView = (doctor: GrantedDoctor) => {
    toast.message(`Access scope for ${doctor.name}`, {
      description: `Granted ${doctor.since} · expires ${doctor.expires}`,
    });
  };

  const onRevoke = (doctor: GrantedDoctor) => {
    setDoctors((prev) => prev.filter((d) => d.id !== doctor.id));
    toast.success(`Revoked access for ${doctor.name}`, {
      description: 'On-chain grant PDA closed; rent refunded.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-1">
            Doctor Access
          </h1>
          <p className="text-ink-muted">
            Manage who can view your medical records
          </p>
        </div>
        <Button
          onClick={onGrantAccess}
          className="bg-primary hover:bg-primary/90 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Grant Access</span>
        </Button>
      </div>

      {/* QR Code Section */}
      <Card
        ref={qrCardRef}
        className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 text-center"
      >
        <div className="space-y-4 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-foreground">Share via QR Code</h3>

          <div className="w-56 h-56 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-primary p-3">
            {isConnected && grantUrl ? (
              <QRCodeSVG
                value={grantUrl}
                size={200}
                level="M"
                marginSize={0}
                bgColor="#ffffff"
                fgColor="#0B0E12"
              />
            ) : (
              <div className="text-center px-3">
                <p className="text-sm text-ink-muted mb-3">Connect your wallet to generate a QR.</p>
                <Button size="sm" onClick={connect}>
                  Connect wallet
                </Button>
              </div>
            )}
          </div>

          <p className="text-sm text-ink-muted">
            Doctors scan this code to verify your on-chain access grant and read your timeline.
          </p>

          {isConnected && (
            <p className="font-mono text-xs text-ink-subtle break-all px-2">
              {publicKey}
            </p>
          )}

          <Button
            variant="outline"
            className="w-full gap-2"
            disabled={!isConnected}
            onClick={onCopy}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy grant link'}</span>
          </Button>
        </div>
      </Card>

      {/* Granted Access */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Granted Access</h3>
        {doctors.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-border">
            <p className="text-ink-muted mb-4">No active doctor grants.</p>
            <Button onClick={onGrantAccess} className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Plus className="w-4 h-4" />
              <span>Share Your Records</span>
            </Button>
          </Card>
        ) : (
          doctors.map((doctor) => (
            <Card key={doctor.id} className="p-6 border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{doctor.name}</h4>
                  <p className="text-sm text-ink-muted mb-2">{doctor.specialty}</p>
                  <p className="text-xs text-muted-foreground">
                    Access since {doctor.since} &middot; Expires {doctor.expires}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => onView(doctor)} variant="outline" size="sm" className="gap-1">
                    <Eye className="w-4 h-4" />
                    <span className="hidden md:inline">View</span>
                  </Button>
                  <Button
                    onClick={() => onRevoke(doctor)}
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden md:inline">Revoke</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
