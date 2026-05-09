import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Bell, Lock, User, Download, Trash2 } from 'lucide-react';

export default function SettingsPage() {
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
              type="text"
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
              placeholder="john@example.com"
              className="h-10"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Save Changes
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
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <p className="font-medium text-foreground">Medication Reminders</p>
              <p className="text-sm text-ink-muted">Get notified when it&apos;s time to take medications</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <p className="font-medium text-foreground">Health Insights</p>
              <p className="text-sm text-ink-muted">Weekly summaries of your health patterns</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6 border-border">
        <div className="flex items-center gap-4 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Privacy & Security</h2>
        </div>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Download My Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button
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
            <a href="#" className="hover:text-primary">Terms</a>
            <span>â€¢</span>
            <a href="#" className="hover:text-primary">Privacy</a>
            <span>â€¢</span>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </Card>
    </div>
  );
}
