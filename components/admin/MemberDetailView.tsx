'use client';

import React from 'react';
import Link from 'next/link';
import { MemberStats, DailyRecord } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { ArrowLeft, Flame, Calendar, CheckCircle2, TrendingUp, BookOpen, Sun } from 'lucide-react';
import { HistoryTable } from '../history/HistoryTable';

interface MemberDetailViewProps {
  stats: MemberStats;
  history: DailyRecord[];
}

export const MemberDetailView: React.FC<MemberDetailViewProps> = ({ stats, history }) => {
  const { user } = stats;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/admin/members"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Members Directory
      </Link>

      {/* Member Header Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase bg-gray-100 text-gray-700 rounded-md">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{user.email}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  {stats.streakDays} Day Streak
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
            <div className="text-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 flex-1 sm:flex-initial">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Weekly Avg</p>
              <p className="text-xl font-extrabold text-gray-900">{stats.weeklyAvg}%</p>
            </div>
            <div className="text-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 flex-1 sm:flex-initial">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Monthly Avg</p>
              <p className="text-xl font-extrabold text-gray-900">{stats.monthlyAvg}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Activity Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Prayers Consistency</h3>
              <p className="text-xs text-gray-400">5 Daily Prayers</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Fajr</span>
              <span className="font-bold text-gray-900">92%</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Dhuhr</span>
              <span className="font-bold text-gray-900">88%</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Asr</span>
              <span className="font-bold text-gray-900">85%</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Maghrib</span>
              <span className="font-bold text-gray-900">95%</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-600 font-medium">Isha</span>
              <span className="font-bold text-gray-900">90%</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Quran Habits</h3>
              <p className="text-xs text-gray-400">Recitation & Reflection</p>
            </div>
          </div>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-gray-600">Daily Recitation</span>
                <span className="font-bold text-gray-900">78%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-gray-600">Quran + Meaning</span>
                <span className="font-bold text-gray-900">62%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '62%' }} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Adhkar Remembrance</h3>
              <p className="text-xs text-gray-400">Morning & Evening</p>
            </div>
          </div>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-gray-600">Morning Adhkar</span>
                <span className="font-bold text-gray-900">84%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '84%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-gray-600">Evening Adhkar</span>
                <span className="font-bold text-gray-900">80%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Member History Table */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">30-Day Activity History</h3>
        <HistoryTable records={history} />
      </div>
    </div>
  );
};
