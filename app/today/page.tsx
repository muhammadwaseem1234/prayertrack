'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { AppLayout } from '../../components/layout/AppLayout';
import { PrayerTrackerCard } from '../../components/dashboard/PrayerTrackerCard';
import { SpiritualHabitsCard } from '../../components/dashboard/SpiritualHabitsCard';
import { Button } from '../../components/ui/Button';
import {
  getCurrentUser,
  getTodayActivity,
  updatePrayerStatus,
  updateHabitStatus,
  saveDailyRecord,
  getFormattedDate,
} from '../../lib/dataService';
import { DailyRecord, PrayerName, PrayerStatus, SpiritualHabits } from '../../types';
import { CheckCircle2, Save, AlertCircle, Loader2 } from 'lucide-react';

export default function TodayPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [record, setRecord] = useState<DailyRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const activeUserId = clerkUser ? clerkUser.id : getCurrentUser().id;

  const userProfile = clerkUser
    ? {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.username || 'Member',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        avatarUrl: clerkUser.imageUrl,
      }
    : undefined;

  useEffect(() => {
    async function loadToday() {
      if (!isLoaded) return;
      const data = await getTodayActivity(activeUserId);
      setRecord(data);
    }
    loadToday();
  }, [activeUserId, isLoaded]);

  const handleUpdatePrayer = async (prayer: PrayerName, status: PrayerStatus) => {
    if (!record) return;
    const updated = await updatePrayerStatus(activeUserId, record.date, prayer, status, userProfile);
    if (updated) setRecord({ ...updated });
  };

  const handleUpdateHabit = async (habit: keyof SpiritualHabits, completed: boolean) => {
    if (!record) return;
    const updated = await updateHabitStatus(activeUserId, record.date, habit, completed, userProfile);
    if (updated) setRecord({ ...updated });
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
        message: 'Your activity log has been submitted and saved to Supabase!',
      });
    } else {
      setToast({
        type: 'error',
        message: res.error || 'Failed to save to Supabase. Check database permissions.',
      });
    }

    setTimeout(() => setToast(null), 5000);
  };

  if (!record) return null;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Today's Tracker</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Record and review your spiritual activities for {getFormattedDate(0)}.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              {record.completionRate}% Completed
            </span>

            <Button
              variant="secondary"
              size="md"
              disabled={saving}
              onClick={handleSubmitRecord}
              className="gap-2 shadow-sm font-semibold text-xs"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Submit Today's Activity</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Toast Notification Banner */}
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

        <PrayerTrackerCard record={record} onUpdatePrayer={handleUpdatePrayer} />
        <SpiritualHabitsCard record={record} onUpdateHabit={handleUpdateHabit} />
      </div>
    </AppLayout>
  );
}
