'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Sparkles, UserCheck } from 'lucide-react';
import { getCurrentUser, setCurrentUserId, getMembers } from '../../lib/dataService';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const currentUser = getCurrentUser();
  const members = getMembers();

  // Format today date nicely
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const getTitle = () => {
    if (pathname === '/dashboard') return 'Today';
    if (pathname === '/today') return "Today's Tracker";
    if (pathname === '/history') return 'History Log';
    if (pathname === '/analytics') return 'Personal Analytics';
    if (pathname === '/admin') return 'Admin Overview';
    if (pathname.startsWith('/admin/members')) return 'Group Members';
    if (pathname === '/admin/analytics') return 'Group Analytics';
    return 'PrayerTrack';
  };

  const handleSwitchUser = (userId: string) => {
    setCurrentUserId(userId);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between z-10">
      {/* Title / Context */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </Link>
        <div>
          <h2 className="text-base md:text-lg font-bold text-gray-900 tracking-tight leading-none">
            {getTitle()}
          </h2>
          <p className="text-xs text-gray-400 font-medium hidden sm:block mt-0.5">
            PrayerTrack Private Dashboard
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Date badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100/80 border border-gray-200/60 text-xs font-medium text-gray-600">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{todayFormatted}</span>
        </div>

        {/* Mobile Demo Persona Select */}
        <div className="md:hidden">
          <select
            value={currentUser.id}
            onChange={(e) => handleSwitchUser(e.target.value)}
            className="bg-gray-100 border border-gray-200 rounded-lg text-xs py-1 px-2 text-gray-800 focus:outline-none"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name.split(' ')[0]} ({m.role})
              </option>
            ))}
          </select>
        </div>

        {/* User avatar indicator */}
        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full object-cover border border-gray-200"
          />
          <span className="text-xs font-semibold text-gray-800">{currentUser.name}</span>
        </div>
      </div>
    </header>
  );
};
