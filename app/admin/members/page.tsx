'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { MembersTable } from '../../../components/admin/MembersTable';
import { getAllMembersStats } from '../../../lib/dataService';
import { MemberStats } from '../../../types';

export default function AdminMembersPage() {
  const [membersStats, setMembersStats] = useState<MemberStats[]>([]);

  useEffect(() => {
    async function loadMembers() {
      const stats = await getAllMembersStats();
      setMembersStats(stats);
    }
    loadMembers();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Group Members Directory</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Detailed breakdown of today's prayer, Quran, and Adhkar progress for all members.
          </p>
        </div>

        <MembersTable membersStats={membersStats} />
      </div>
    </AppLayout>
  );
}
