'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { AdminAnalyticsView } from '../../../components/admin/AdminAnalyticsView';
import { getGroupAnalytics } from '../../../lib/dataService';
import { GroupAnalytics } from '../../../types';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<GroupAnalytics | null>(null);

  useEffect(() => {
    setAnalytics(getGroupAnalytics());
  }, []);

  if (!analytics) return null;

  return (
    <AppLayout>
      <AdminAnalyticsView analytics={analytics} />
    </AppLayout>
  );
}
