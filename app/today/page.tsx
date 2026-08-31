'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { PrayerTrackerCard } from '../../components/dashboard/PrayerTrackerCard';
import { SpiritualHabitsCard } from '../../components/dashboard/SpiritualHabitsCard';
import {
  getCurrentUser,
  getTodayActivity,
  updatePrayerStatus,
  updateHabitStatus,
  getFormattedDate,
} from '../../lib/dataService';
import { DailyRecord, PrayerName, PrayerStatus, SpiritualHabits } from '../../types';

export default function TodayPage() {
  const [record, setRecord] = useState<DailyRecord | null>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    setRecord(getTodayActivity(currentUser.id));
  }, [currentUser.id]);

  const handleUpdatePrayer = (prayer: PrayerName, status: PrayerStatus) => {
    if (!record) return;
    const updated = updatePrayerStatus(currentUser.id, record.date, prayer, status);
    setRecord({ ...updated });
  };

  const handleUpdateHabit = (habit: keyof SpiritualHabits, completed: boolean) => {
    if (!record) return;
    const updated = updateHabitStatus(currentUser.id, record.date, habit, completed);
    setRecord({ ...updated });
  };

  if (!record) return null;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Today's Tracker</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Record and review your spiritual activities for {getFormattedDate(0)}.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
            {record.completionRate}% Completed
          </span>
        </div>

        <PrayerTrackerCard record={record} onUpdatePrayer={handleUpdatePrayer} />
        <SpiritualHabitsCard record={record} onUpdateHabit={handleUpdateHabit} />
      </div>
    </AppLayout>
  );
}
