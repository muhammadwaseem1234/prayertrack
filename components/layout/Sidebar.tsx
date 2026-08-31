'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  History,
  BarChart3,
  Users,
  ShieldCheck,
  UserCheck,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { getCurrentUser, setCurrentUserId, getMembers } from '../../lib/dataService';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = getCurrentUser();
  const members = getMembers();

  const handleSwitchUser = (userId: string) => {
    setCurrentUserId(userId);
    // Refresh page to apply user state
    window.location.reload();
  };

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
            {currentUser.role === 'admin' ? (
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

        {/* Demo Switcher Box */}
        <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-200/80 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 font-medium mb-2">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Demo Switch Persona:</span>
          </div>
          <select
            value={currentUser.id}
            onChange={(e) => handleSwitchUser(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg text-xs py-1.5 px-2 text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer User Info */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
          <div className="leading-tight">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[110px]">
              {currentUser.name}
            </p>
            <p className="text-[11px] text-gray-400 truncate max-w-[110px]">
              {currentUser.email}
            </p>
          </div>
        </div>

        <Link
          href="/"
          title="Logout to landing page"
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
};
