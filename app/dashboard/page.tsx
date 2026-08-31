'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { AppLayout } from '../../components/layout/AppLayout';
import { DailyProgressCard } from '../../components/dashboard/DailyProgressCard';
import { PrayerTrackerCard } from '../../components/dashboard/PrayerTrackerCard';
import { SpiritualHabitsCard } from '../../components/dashboard/SpiritualHabitsCard';
import { ConsistencyCard } from '../../components/dashboard/ConsistencyCard';
import { Button } from '../../components/ui/Button';
import {
  getCurrentUser,
  getTodayActivity,
  updatePrayerStatus,
  updateHabitStatus,
  saveDailyRecord,
  getMemberStats,
} from '../../lib/dataService';
import { DailyRecord, MemberStats, PrayerName, PrayerStatus, SpiritualHabits } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';
import { CheckCircle2, Save, AlertCircle, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [record, setRecord] = useState<DailyRecord | null>(null);
  const [memberStats, setMemberStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const activeUserId = clerkUser ? clerkUser.id : getCurrentUser().id;
  const activeUserName = clerkUser
    ? clerkUser.firstName || clerkUser.fullName || 'User'
    : getCurrentUser().name.split(' ')[0];

  const userProfile = clerkUser
    ? {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.username || 'Member',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        avatarUrl: clerkUser.imageUrl,
      }
    : undefined;

  useEffect(() => {
    async function loadData() {
      if (!isLoaded) return;
      setLoading(true);
      const [todayData, statsData] = await Promise.all([
        getTodayActivity(activeUserId),
        getMemberStats(activeUserId),
      ]);
      setRecord(todayData);
      setMemberStats(statsData);
      setLoading(false);
    }
    loadData();
  }, [activeUserId, isLoaded]);

  const handleUpdatePrayer = async (prayer: PrayerName, status: PrayerStatus) => {
    if (!record) return;
    const updated = await updatePrayerStatus(activeUserId, record.date, prayer, status, userProfile);
    if (updated) {
      setRecord({ ...updated });
      const statsData = await getMemberStats(activeUserId);
      setMemberStats(statsData);
    }
  };

  const handleUpdateHabit = async (habit: keyof SpiritualHabits, completed: boolean) => {
    if (!record) return;
    const updated = await updateHabitStatus(activeUserId, record.date, habit, completed, userProfile);
    if (updated) {
      setRecord({ ...updated });
      const statsData = await getMemberStats(activeUserId);
      setMemberStats(statsData);
    }
  };

  const handleSubmitRecord = async () => {
    if (!record) return;
    setSaving(true);
    setToast(null);

    const res = await saveDailyRecord(record, userProfile);
    setSaving(false);

    if (res.success) {
      if (res.data) setRecord(res.data);
      setToast({
        type: 'success',
        message: 'Your daily activity log has been saved to Supabase!',
      });
      const statsData = await getMemberStats(activeUserId);
      setMemberStats(statsData);
    } else {
      setToast({
        type: 'error',
        message: res.error || 'Failed to save to Supabase. Please check table RLS permissions.',
      });
    }

    setTimeout(() => setToast(null), 5000);
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
        {/* User Greeting & Save Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Good evening, {activeUserName}.
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Keep your day consistent, one prayer at a time.
            </p>
          </div>

          <Button
            variant="secondary"
            size="lg"
            disabled={saving}
            onClick={handleSubmitRecord}
            className="gap-2 shadow-sm font-semibold text-sm w-full sm:w-auto"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Supabase...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Submit Today's Activity</span>
              </>
            )}
          </Button>
        </div>

        {/* Toast Alert Banner */}
        {toast && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-xs font-bold px-2 py-1 rounded-lg hover:bg-black/5"
            >
              Dismiss
            </button>
          </div>
        )}

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
