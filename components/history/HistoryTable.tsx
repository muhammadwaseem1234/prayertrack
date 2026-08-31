'use client';

import React from 'react';
import { DailyRecord } from '../../types';
import { Badge } from '../ui/Badge';
import { Check, X, Clock, CheckCheck, BookOpen, Sun, Moon, Sparkles } from 'lucide-react';

interface HistoryTableProps {
  records: DailyRecord[];
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-500 text-sm">
        No historical records found for the selected range.
      </div>
    );
  }

  const renderPrayerBadge = (status: string) => {
    switch (status) {
      case 'jamaah':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCheck className="w-3 h-3 text-emerald-700" />
            Jamaah
          </span>
        );
      case 'yes':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            <Check className="w-3 h-3 text-emerald-600" />
            Prayed
          </span>
        );
      case 'delayed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Delayed
          </span>
        );
      case 'no':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <X className="w-3 h-3 text-rose-600" />
            Missed
          </span>
        );
    }
  };

  const renderHabitCheck = (val: boolean) => {
    return val ? (
      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center font-bold text-xs">
        ✓
      </span>
    ) : (
      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 inline-flex items-center justify-center text-xs">
        -
      </span>
    );
  };

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200/80 bg-white card-shadow">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-500 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-3">Fajr</th>
              <th className="py-3.5 px-3">Dhuhr</th>
              <th className="py-3.5 px-3">Asr</th>
              <th className="py-3.5 px-3">Maghrib</th>
              <th className="py-3.5 px-3">Isha</th>
              <th className="py-3.5 px-3 text-center">Quran</th>
              <th className="py-3.5 px-3 text-center">M. Adhkar</th>
              <th className="py-3.5 px-3 text-center">E. Adhkar</th>
              <th className="py-3.5 px-3 text-center">Q + Meaning</th>
              <th className="py-3.5 px-4 text-right">Completion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {records.map((rec) => {
              const formattedDate = new Date(rec.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr key={rec.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{formattedDate}</td>
                  <td className="py-3.5 px-3">{renderPrayerBadge(rec.prayers.fajr)}</td>
                  <td className="py-3.5 px-3">{renderPrayerBadge(rec.prayers.dhuhr)}</td>
                  <td className="py-3.5 px-3">{renderPrayerBadge(rec.prayers.asr)}</td>
                  <td className="py-3.5 px-3">{renderPrayerBadge(rec.prayers.maghrib)}</td>
                  <td className="py-3.5 px-3">{renderPrayerBadge(rec.prayers.isha)}</td>
                  <td className="py-3.5 px-3 text-center">{renderHabitCheck(rec.habits.quran)}</td>
                  <td className="py-3.5 px-3 text-center">
                    {renderHabitCheck(rec.habits.morningAdhkar)}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {renderHabitCheck(rec.habits.eveningAdhkar)}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {renderHabitCheck(rec.habits.quranMeaning)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-block font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                      {rec.completionRate}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {records.map((rec) => {
          const formattedDate = new Date(rec.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div key={rec.id} className="p-4 bg-white rounded-2xl border border-gray-200 card-shadow">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                <span className="text-sm font-bold text-gray-900">{formattedDate}</span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                  {rec.completionRate}% Done
                </span>
              </div>

              {/* Prayers row */}
              <div className="grid grid-cols-5 gap-1 text-center mb-3">
                {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((p) => (
                  <div key={p} className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-semibold text-gray-400 mb-1">
                      {p[0].toUpperCase() + p.slice(1, 3)}
                    </span>
                    {renderPrayerBadge(rec.prayers[p])}
                  </div>
                ))}
              </div>

              {/* Habits row */}
              <div className="flex items-center justify-around bg-gray-50 p-2 rounded-xl text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                  Quran: {rec.habits.quran ? '✓' : '-'}
                </span>
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-gray-400" />
                  M.Adhkar: {rec.habits.morningAdhkar ? '✓' : '-'}
                </span>
                <span className="flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-gray-400" />
                  E.Adhkar: {rec.habits.eveningAdhkar ? '✓' : '-'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
