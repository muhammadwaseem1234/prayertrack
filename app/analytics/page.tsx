'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { getCurrentUser, getActivityHistory, getMemberStats } from '../../lib/dataService';
import { MemberStats, DailyRecord } from '../../types';
import { Flame, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [history, setHistory] = useState<DailyRecord[]>([]);

  const activeUserId = clerkUser ? clerkUser.id : getCurrentUser().id;

  useEffect(() => {
    async function loadAnalytics() {
      if (!isLoaded) return;
      const [statsData, historyData] = await Promise.all([
        getMemberStats(activeUserId),
        getActivityHistory(activeUserId),
      ]);
      setStats(statsData);
      setHistory(historyData);
    }
    loadAnalytics();
  }, [activeUserId, isLoaded]);

  if (!stats) return null;

  const prayersList = [
    { name: 'Fajr', key: 'fajr', percent: 94 },
    { name: 'Dhuhr', key: 'dhuhr', percent: 89 },
    { name: 'Asr', key: 'asr', percent: 85 },
    { name: 'Maghrib', key: 'maghrib', percent: 96 },
    { name: 'Isha', key: 'isha', percent: 91 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Personal Analytics</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Track your personal worship consistency and habits over time.
          </p>
        </div>

        {/* Top Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Flame className="w-6 h-6 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase">Current Streak</p>
              <p className="text-2xl font-extrabold text-gray-900">{stats.streakDays} Days</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase">Weekly Average</p>
              <p className="text-2xl font-extrabold text-gray-900">{stats.weeklyAvg}%</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-800 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase">Monthly Average</p>
              <p className="text-2xl font-extrabold text-gray-900">{stats.monthlyAvg}%</p>
            </div>
          </Card>
        </div>

        {/* Prayer Breakdown */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>5 Daily Prayers Consistency</CardTitle>
              <CardDescription>Your completion rate across individual prayers.</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-4">
            {prayersList.map((p) => (
              <div key={p.name} className="flex items-center gap-4">
                <span className="w-16 text-xs font-semibold text-gray-700">{p.name}</span>
                <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${p.percent}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs font-bold text-gray-900">{p.percent}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
