'use client';

import React, { useState, useEffect, use } from 'react';
import { AppLayout } from '../../../../components/layout/AppLayout';
import { MemberDetailView } from '../../../../components/admin/MemberDetailView';
import { getMemberStats, getActivityHistory } from '../../../../lib/dataService';
import { MemberStats, DailyRecord } from '../../../../types';
import { Skeleton } from '../../../../components/ui/Skeleton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MemberDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const memberId = resolvedParams.id;

  const [stats, setStats] = useState<MemberStats | null>(null);
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMemberDetail() {
      if (memberId) {
        setLoading(true);
        const [statsData, historyData] = await Promise.all([
          getMemberStats(memberId),
          getActivityHistory(memberId),
        ]);
        setStats(statsData);
        setHistory(historyData);
        setLoading(false);
      }
    }
    loadMemberDetail();
  }, [memberId]);

  if (loading || !stats) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <MemberDetailView stats={stats} history={history} />
    </AppLayout>
  );
}
