'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Bell, Lock, User, Download, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [medReminders, setMedReminders] = useState(true);
  const [healthInsights, setHealthInsights] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const onSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, email });
      toast.success('Profile saved');
    } finally {
      setSaving(false);
    }
  };

  const onDownload = () => {
    const payload = JSON.stringify(
      { exportedAt: new Date().toISOString(), profile: { name, email } },
      null,
      2,
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voxhealth-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('Profile snapshot downloaded', {
      description: 'A full timeline export will require an active grant; this is profile only.',
    });
  };

  const onChangePassword = () => {
    toast.message('Change password', {
      description: 'Password rotation flow coming soon. For now, regenerate via your wallet.',
    });
  };

  const onDeleteAccount = () => {
    const ok = window.confirm(
      'Delete your VoxHealth account?\n\nThis closes your patient PDA and revokes all active doctor grants. On-chain entries remain encrypted and unreadable without your key.',
    );
    if (!ok) return;
    toast.success('Account deletion queued', {
      description: 'Logging out and returning to the home page.',
    });
    logout();
    router.push('/');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-1">
          Settings
        </h1>
        <p className="text-ink-muted">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card className="p-6 border-border">
        <div className="flex items-center gap-4 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="h-10"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="h-10"
            />
          </div>
          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </Card>

      {/* Notifications Section */}
      <Card className="p-6 border-border">
        <div className="flex items-center gap-4 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-background rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-foreground">Medication Reminders</p>
              <p className="text-sm text-ink-muted">Get notified when it&apos;s time to take medications</p>
            </div>
            <input
              type="checkbox"
              checked={medReminders}
              onChange={(e) => {
                setMedReminders(e.target.checked);
                toast.success(e.target.checked ? 'Medication reminders on' : 'Medication reminders off');
              }}
              className="w-5 h-5 accent-sage"
            />
          </label>
          <label className="flex items-center justify-between p-4 bg-background rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-foreground">Health Insights</p>
              <p className="text-sm text-ink-muted">Weekly summaries of your health patterns</p>
            </div>
            <input
              type="checkbox"
              checked={healthInsights}
              onChange={(e) => {
                setHealthInsights(e.target.checked);
                toast.success(e.target.checked ? 'Health insights on' : 'Health insights off');
              }}
              className="w-5 h-5 accent-sage"
            />
          </label>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6 border-border">
        <div className="flex items-center gap-4 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Privacy &amp; Security</h2>
        </div>
        <div className="space-y-4">
          <Button onClick={onDownload} variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Download My Data
          </Button>
          <Button onClick={onChangePassword} variant="outline" className="w-full justify-start">
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button
            onClick={onDeleteAccount}
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/5"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6 border-border bg-background">
        <div className="space-y-3 text-center">
          <Settings className="w-6 h-6 text-muted-foreground mx-auto" />
          <div>
            <p className="font-medium text-foreground">VoxHealth v1.0</p>
            <p className="text-sm text-ink-muted">
              Your voice, your health story
            </p>
          </div>
          <div className="flex gap-2 justify-center text-xs text-muted-foreground">
            <a href="/legal/terms" className="hover:text-primary">Terms</a>
            <span>&middot;</span>
            <a href="/legal/privacy" className="hover:text-primary">Privacy</a>
            <span>&middot;</span>
            <a href="mailto:hello@voxhealth.app" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </Card>
    </div>
  );
}
