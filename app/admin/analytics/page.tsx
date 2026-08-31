'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { AdminAnalyticsView } from '../../../components/admin/AdminAnalyticsView';
import { getGroupAnalytics } from '../../../lib/dataService';
import { GroupAnalytics } from '../../../types';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<GroupAnalytics | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      const data = await getGroupAnalytics();
      setAnalytics(data);
    }
    loadAnalytics();
  }, []);

  if (!analytics) return null;

  return (
    <AppLayout>
      <AdminAnalyticsView analytics={analytics} />
    </AppLayout>
  );
}
