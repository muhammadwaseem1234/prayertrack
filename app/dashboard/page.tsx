'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { DailyProgressCard } from '../../components/dashboard/DailyProgressCard';
import { PrayerTrackerCard } from '../../components/dashboard/PrayerTrackerCard';
import { SpiritualHabitsCard } from '../../components/dashboard/SpiritualHabitsCard';
import { ConsistencyCard } from '../../components/dashboard/ConsistencyCard';
import {
  getCurrentUser,
  getTodayActivity,
  updatePrayerStatus,
  updateHabitStatus,
  getMemberStats,
} from '../../lib/dataService';
import { DailyRecord, MemberStats, PrayerName, PrayerStatus, SpiritualHabits } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';

export default function DashboardPage() {
  const [record, setRecord] = useState<DailyRecord | null>(null);
  const [memberStats, setMemberStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [todayData, statsData] = await Promise.all([
        getTodayActivity(currentUser.id),
        getMemberStats(currentUser.id),
      ]);
      setRecord(todayData);
      setMemberStats(statsData);
      setLoading(false);
    }
    loadData();
  }, [currentUser.id]);

  const handleUpdatePrayer = async (prayer: PrayerName, status: PrayerStatus) => {
    if (!record) return;
    const updated = await updatePrayerStatus(currentUser.id, record.date, prayer, status);
    if (updated) {
      setRecord({ ...updated });
      const statsData = await getMemberStats(currentUser.id);
      setMemberStats(statsData);
    }
  };

  const handleUpdateHabit = async (habit: keyof SpiritualHabits, completed: boolean) => {
    if (!record) return;
    const updated = await updateHabitStatus(currentUser.id, record.date, habit, completed);
    if (updated) {
      setRecord({ ...updated });
      const statsData = await getMemberStats(currentUser.id);
      setMemberStats(statsData);
    }
  };

  if (loading || !record || !memberStats) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* User Greeting */}
        <div className="mb-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Good evening, {currentUser.name.split(' ')[0]}.
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Keep your day consistent, one prayer at a time.
          </p>
        </div>

        {/* Today's Progress Card */}
        <DailyProgressCard record={record} />

        {/* Main Grid: Prayers & Habits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PrayerTrackerCard record={record} onUpdatePrayer={handleUpdatePrayer} />
          </div>

          <div className="space-y-6">
            <SpiritualHabitsCard record={record} onUpdateHabit={handleUpdateHabit} />
            <ConsistencyCard
              record={record}
              streakDays={memberStats.streakDays}
              weeklyAvg={memberStats.weeklyAvg}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
