'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard,
  CalendarDays,
  History,
  BarChart3,
  Users,
  ShieldCheck,
  UserCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { getCurrentUser, setCurrentUserId, syncUserProfile } from '../../lib/dataService';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user: clerkUser, isLoaded } = useUser();
  const mockUser = getCurrentUser();

  // Sync Clerk authenticated user to Supabase profile table when signed in
  useEffect(() => {
    if (clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || '';
      const name = clerkUser.fullName || clerkUser.username || 'Member';
      const avatarUrl = clerkUser.imageUrl;
      const role = (clerkUser.publicMetadata?.role as string) || 'member';

      syncUserProfile({
        id: clerkUser.id,
        name,
        email,
        avatarUrl,
        role,
      });
    }
  }, [clerkUser]);

  const activeUser = clerkUser
    ? {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.username || 'Your Profile',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        avatarUrl: clerkUser.imageUrl,
        role: ((clerkUser.publicMetadata?.role as string) || 'member') as 'admin' | 'member',
      }
    : mockUser;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Today', href: '/today', icon: CalendarDays },
    { name: 'History', href: '/history', icon: History },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const adminNavItems = [
    { name: 'Admin Overview', href: '/admin', icon: ShieldCheck },
    { name: 'Members', href: '/admin/members', icon: Users },
    { name: 'Admin Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-gray-200/80 bg-white h-screen sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-6 pb-5 flex items-center justify-between border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none tracking-tight">
              PrayerTrack
            </h1>
            <span className="text-[10px] font-medium text-emerald-700 uppercase tracking-wider">
              Private Group
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Main Section */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Personal Tracker
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gray-100 text-gray-900 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Section */}
        <div>
          <div className="px-3 flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Administration
            </p>
            {activeUser.role === 'admin' ? (
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded">
                Admin
              </span>
            ) : (
              <span className="px-1.5 py-0.5 text-[9px] font-medium text-gray-400 bg-gray-100 rounded">
                Member View
              </span>
            )}
          </div>
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gray-100 text-gray-900 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer User Info */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {clerkUser ? (
            <UserButton />
          ) : (
            <img
              src={activeUser.avatarUrl}
              alt={activeUser.name}
              className="w-9 h-9 rounded-full object-cover border border-gray-200"
            />
          )}
          <div className="leading-tight min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activeUser.name}
            </p>
            <p className="text-[11px] text-gray-400 truncate">
              {activeUser.email}
            </p>
          </div>
        </div>

        {!clerkUser && (
          <Link
            href="/"
            title="Logout"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        )}
      </div>
    </aside>
  );
};
