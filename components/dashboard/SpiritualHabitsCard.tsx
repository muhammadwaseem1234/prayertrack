'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { SegmentedControl } from '../ui/SegmentedControl';
import { DailyRecord, SpiritualHabits } from '../../types';
import { BookOpen, Sun, Moon, Sparkles } from 'lucide-react';

interface SpiritualHabitsCardProps {
  record: DailyRecord;
  onUpdateHabit: (habit: keyof SpiritualHabits, completed: boolean) => void;
}

export const SpiritualHabitsCard: React.FC<SpiritualHabitsCardProps> = ({
  record,
  onUpdateHabit,
}) => {
  const habitItems: {
    key: keyof SpiritualHabits;
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      key: 'quran',
      title: 'Quran Recitation',
      description: 'Daily recitation of the Holy Quran',
      icon: BookOpen,
    },
    {
      key: 'morningAdhkar',
      title: 'Morning Adhkar',
      description: 'Remembrances after Fajr prayer',
      icon: Sun,
    },
    {
      key: 'eveningAdhkar',
      title: 'Evening Adhkar',
      description: 'Remembrances after Asr/Maghrib',
      icon: Moon,
    },
    {
      key: 'quranMeaning',
      title: 'Quran Recitation With Meaning',
      description: 'Studying and pondering Quranic translation & Tafsir',
      icon: Sparkles,
    },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div>
          <CardTitle>Spiritual Habits</CardTitle>
          <CardDescription>
            Track daily Quran recitation and Adhkar remembrances.
          </CardDescription>
        </div>
      </CardHeader>

      <div className="space-y-4">
        {habitItems.map((item) => {
          const Icon = item.icon;
          const isCompleted = record.habits[item.key];
          return (
            <div
              key={item.key}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</h4>
                  <p className="text-xs text-gray-400 font-medium hidden md:block truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-auto">
                <SegmentedControl
                  value={isCompleted}
                  onChange={(val) => onUpdateHabit(item.key, val)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
