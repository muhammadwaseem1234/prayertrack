'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, History, ShieldCheck, BarChart3 } from 'lucide-react';
import { getCurrentUser } from '../../lib/dataService';

export const MobileNavigation: React.FC = () => {
  const pathname = usePathname();
  const currentUser = getCurrentUser();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Today', href: '/today', icon: CalendarDays },
    { name: 'History', href: '/history', icon: History },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  if (currentUser.role === 'admin') {
    navItems.push({ name: 'Admin', href: '/admin', icon: ShieldCheck });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-2 py-2 flex items-center justify-around z-30">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href === '/admin' && pathname.startsWith('/admin'));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : ''}`} />
            <span className="text-[10px] mt-1 tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
