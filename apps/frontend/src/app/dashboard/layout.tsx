'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/courses', label: 'Courses', icon: '📚' },
  { href: '/dashboard/mentor', label: 'AI Mentor', icon: '🤖' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }
    // Decode JWT to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch {
      router.push('/auth');
    }
  }, [router]);

  const handleLogout = () => {
    api.setToken(null);
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-56 bg-slate-900 border-r border-slate-800 p-4 flex flex-col">
        <div className="mb-8">
          <Link href="/dashboard" className="text-xl font-bold text-purple-400">
            ⚡ ApexCampus
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                  active
                    ? 'bg-purple-600/20 text-purple-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 pt-4">
          <div className="text-sm text-slate-400 mb-2 truncate">
            {user?.email || 'User'}
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-950 justify-start"
          >
            🚪 Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 p-8">
        {children}
      </main>
    </div>
  );
}
