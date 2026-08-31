'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { DailyRecord } from '../../types';
import { BookOpen, Moon, Sun, CheckCircle2 } from 'lucide-react';

interface DailyProgressCardProps {
  record: DailyRecord;
}

export const DailyProgressCard: React.FC<DailyProgressCardProps> = ({ record }) => {
  // Count completed items
  const prayersCompleted = Object.values(record.prayers).filter(
    (s) => s === 'yes' || s === 'jamaah'
  ).length;

  const habitsList = [
    { label: 'Quran Recitation', value: record.habits.quran, icon: BookOpen },
    { label: 'Morning Adhkar', value: record.habits.morningAdhkar, icon: Sun },
    { label: 'Evening Adhkar', value: record.habits.eveningAdhkar, icon: Moon },
    { label: 'Quran + Meaning', value: record.habits.quranMeaning, icon: CheckCircle2 },
  ];

  const habitsCompleted = habitsList.filter((h) => h.value).length;
  const totalCompleted = prayersCompleted + habitsCompleted;
  const totalActivities = 9; // 5 prayers + 4 habits

  return (
    <Card className="mb-6">
      <CardHeader className="mb-4">
        <div>
          <CardTitle>Today's Overview</CardTitle>
          <CardDescription>
            {totalCompleted} of {totalActivities} daily activities completed
          </CardDescription>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">{record.completionRate}%</span>
          <p className="text-xs text-gray-400 font-medium">Completion Score</p>
        </div>
      </CardHeader>

      <ProgressBar value={record.completionRate} size="md" className="mb-6" />

      {/* Breakdown metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex flex-col">
          <span className="text-xs text-gray-500 font-medium mb-1">5 Daily Prayers</span>
          <div className="flex items-baseline justify-between mt-auto">
            <span className="text-base font-bold text-gray-900">{prayersCompleted} / 5</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {Math.round((prayersCompleted / 5) * 100)}%
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex flex-col">
          <span className="text-xs text-gray-500 font-medium mb-1">Quran Recitation</span>
          <div className="flex items-baseline justify-between mt-auto">
            <span className="text-sm font-semibold text-gray-800">
              {record.habits.quran ? 'Completed' : 'Pending'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                record.habits.quran ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex flex-col">
          <span className="text-xs text-gray-500 font-medium mb-1">Adhkar</span>
          <div className="flex items-baseline justify-between mt-auto">
            <span className="text-sm font-semibold text-gray-800">
              {(record.habits.morningAdhkar ? 1 : 0) + (record.habits.eveningAdhkar ? 1 : 0)} / 2
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                record.habits.morningAdhkar && record.habits.eveningAdhkar
                  ? 'bg-emerald-500'
                  : 'bg-amber-400'
              }`}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex flex-col">
          <span className="text-xs text-gray-500 font-medium mb-1">Quran + Meaning</span>
          <div className="flex items-baseline justify-between mt-auto">
            <span className="text-sm font-semibold text-gray-800">
              {record.habits.quranMeaning ? 'Completed' : 'Pending'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                record.habits.quranMeaning ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
