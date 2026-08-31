'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { AdminOverview } from '../../components/admin/AdminOverview';
import { MembersTable } from '../../components/admin/MembersTable';
import { getGroupAnalytics, getAllMembersStats } from '../../lib/dataService';
import { GroupAnalytics, MemberStats } from '../../types';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<GroupAnalytics | null>(null);
  const [membersStats, setMembersStats] = useState<MemberStats[]>([]);

  useEffect(() => {
    setAnalytics(getGroupAnalytics());
    setMembersStats(getAllMembersStats());
  }, []);

  if (!analytics) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded">
                Admin Dashboard
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Today's Group Activity</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Monitor members' daily religious activity and overall consistency.
            </p>
          </div>

          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-all shadow-sm"
          >
            <span>View Full Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Overview Stats Cards */}
        <AdminOverview analytics={analytics} />

        {/* Members Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-900">Group Members Progress</h3>
            <Link href="/admin/members" className="text-xs font-semibold text-emerald-700 hover:underline">
              View All Members &rarr;
            </Link>
          </div>
          <MembersTable membersStats={membersStats} />
        </div>
      </div>
    </AppLayout>
  );
}
