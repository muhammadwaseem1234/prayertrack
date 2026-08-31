'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Flame, TrendingUp, Award } from 'lucide-react';
import { DailyRecord } from '../../types';

interface ConsistencyCardProps {
  record: DailyRecord;
  streakDays: number;
  weeklyAvg: number;
}

export const ConsistencyCard: React.FC<ConsistencyCardProps> = ({
  record,
  streakDays,
  weeklyAvg,
}) => {
  const getEncouragement = (rate: number) => {
    if (rate >= 90) return 'Exceptional consistency today! May Allah accept your effort.';
    if (rate >= 70) return "You're doing well. Keep going and complete the remaining prayers.";
    if (rate >= 50) return 'Steady progress. Every small worship adds up in blessings.';
    return 'Turn your day around with your next prayer.';
  };

  return (
    <Card className="mb-6">
      <CardHeader className="mb-4">
        <div>
          <CardTitle>Daily Consistency</CardTitle>
          <CardDescription>Overall performance and active streak.</CardDescription>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-semibold text-amber-800">
          <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>{streakDays} Day Streak</span>
        </div>
      </CardHeader>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50/80 border border-gray-100 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-900 shadow-sm">
            {record.completionRate}%
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Today's Consistency Score</h4>
            <p className="text-xs text-gray-500 font-medium max-w-sm mt-0.5">
              {getEncouragement(record.completionRate)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-white border border-gray-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">7-Day Average</p>
            <p className="text-sm font-bold text-gray-900">{weeklyAvg}%</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-gray-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Monthly Average</p>
            <p className="text-sm font-bold text-gray-900">84%</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
