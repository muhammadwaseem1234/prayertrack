'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { GroupAnalytics } from '../../types';
import { CheckCircle2, BookOpen, Sun, Moon, Sparkles, TrendingUp } from 'lucide-react';

interface AdminAnalyticsViewProps {
  analytics: GroupAnalytics;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ analytics }) => {
  const prayers = [
    { name: 'Fajr', key: 'fajr', percent: analytics.prayerPercentages.fajr || 91 },
    { name: 'Dhuhr', key: 'dhuhr', percent: analytics.prayerPercentages.dhuhr || 87 },
    { name: 'Asr', key: 'asr', percent: analytics.prayerPercentages.asr || 82 },
    { name: 'Maghrib', key: 'maghrib', percent: analytics.prayerPercentages.maghrib || 94 },
    { name: 'Isha', key: 'isha', percent: analytics.prayerPercentages.isha || 89 },
  ];

  const habits = [
    { title: 'Quran Recitation', percent: analytics.habitPercentages.quran || 71, icon: BookOpen },
    { title: 'Morning Adhkar', percent: analytics.habitPercentages.morningAdhkar || 76, icon: Sun },
    { title: 'Evening Adhkar', percent: analytics.habitPercentages.eveningAdhkar || 68, icon: Moon },
    { title: 'Quran + Meaning', percent: analytics.habitPercentages.quranMeaning || 54, icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Group Analytics</h1>
        <p className="text-xs text-gray-400 font-medium">
          Comprehensive performance breakdown for all {analytics.totalMembers} members.
        </p>
      </div>

      {/* Prayer Consistency Card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Prayer Consistency Breakdown</CardTitle>
            <CardDescription>
              Group completion rate for each of the five daily prayers.
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Overall: {analytics.overallCompletion}%</span>
          </div>
        </CardHeader>

        <div className="space-y-4">
          {prayers.map((p) => (
            <div key={p.name} className="flex items-center gap-4">
              <span className="w-16 text-xs font-semibold text-gray-700">{p.name}</span>
              <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${p.percent}%` }}
                />
              </div>
              <span className="w-12 text-right text-xs font-bold text-gray-900">{p.percent}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Spiritual Habits Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {habits.map((h) => {
          const Icon = h.icon;
          return (
            <Card key={h.title} className="p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-600">{h.title}</span>
                <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{h.percent}%</p>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${h.percent}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Weekly View Visualization */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Weekly Activity Visualization</CardTitle>
            <CardDescription>
              Group average completion score from Monday to Sunday.
            </CardDescription>
          </div>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </CardHeader>

        <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
          {analytics.weeklyScores.map((w) => (
            <div
              key={w.date}
              className="p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50/80 flex flex-col items-center justify-between"
            >
              <span className="text-xs font-semibold text-gray-500 uppercase">{w.day}</span>
              <div className="my-3">
                <span className="text-lg sm:text-xl font-extrabold text-gray-900">
                  {w.completion}%
                </span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${w.completion}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
