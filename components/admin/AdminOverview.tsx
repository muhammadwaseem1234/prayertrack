'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Users, CheckCircle2, BookOpen, Sun, Sparkles } from 'lucide-react';
import { GroupAnalytics } from '../../types';

interface AdminOverviewProps {
  analytics: GroupAnalytics;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ analytics }) => {
  const stats = [
    {
      title: 'Total Group Members',
      value: analytics.totalMembers,
      subtitle: 'Active private group',
      icon: Users,
      color: 'bg-gray-900 text-white',
    },
    {
      title: 'Prayer Completion',
      value: `${analytics.overallCompletion}%`,
      subtitle: 'Overall today across all prayers',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Quran Recitation',
      value: `${analytics.habitPercentages.quran}%`,
      subtitle: `${Math.round((analytics.habitPercentages.quran * analytics.totalMembers) / 100)} of ${analytics.totalMembers} members completed`,
      icon: BookOpen,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Adhkar Completion',
      value: `${Math.round((analytics.habitPercentages.morningAdhkar + analytics.habitPercentages.eveningAdhkar) / 2)}%`,
      subtitle: 'Morning & Evening average',
      icon: Sun,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Quran + Meaning',
      value: `${analytics.habitPercentages.quranMeaning}%`,
      subtitle: 'Deep study & reflection',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500">{stat.title}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-gray-400 font-medium mt-1 truncate">{stat.subtitle}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
