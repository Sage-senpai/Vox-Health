'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, Pill, Users, Settings, Mic, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Today' },
  { href: '/dashboard/timeline', icon: Calendar, label: 'Timeline' },
  { href: '/dashboard/medications', icon: Pill, label: 'Medications' },
  { href: '/dashboard/doctors', icon: Users, label: 'Doctors' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="w-full md:w-64 bg-white border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <span className="font-serif font-bold text-lg text-primary hidden md:inline">
            VoxHealth
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-background'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-border p-4 space-y-4">
        {user && (
          <div className="px-2">
            <p className="text-xs text-muted-foreground mb-1">Signed in as</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {user.name}
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
}
