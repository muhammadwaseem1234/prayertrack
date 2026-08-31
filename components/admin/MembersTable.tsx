'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MemberStats, PrayerStatus } from '../../types';
import { Search, ChevronRight } from 'lucide-react';

interface MembersTableProps {
  membersStats: MemberStats[];
}

export const MembersTable: React.FC<MembersTableProps> = ({ membersStats }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = (membersStats || []).filter((m) =>
    (m.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStatusSymbol = (status: PrayerStatus) => {
    switch (status) {
      case 'jamaah':
        return (
          <span title="Prayed with Jamaah" className="inline-flex items-center text-emerald-700 font-bold text-xs bg-emerald-100 px-1.5 py-0.5 rounded">
            ✓ Jamaah
          </span>
        );
      case 'yes':
        return (
          <span title="Prayed" className="inline-flex items-center text-emerald-600 font-bold text-xs bg-emerald-50 px-1.5 py-0.5 rounded">
            ✓
          </span>
        );
      case 'delayed':
        return (
          <span title="Delayed" className="inline-flex items-center text-amber-700 font-bold text-xs bg-amber-50 px-1.5 py-0.5 rounded">
            Delayed
          </span>
        );
      case 'no':
      default:
        return (
          <span title="Missed" className="inline-flex items-center text-rose-600 font-bold text-xs bg-rose-50 px-1 py-0.5 rounded">
            ×
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 card-shadow overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search group members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <span className="text-xs font-semibold text-gray-500">
          Showing {filteredMembers.length} members
        </span>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-500 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Member</th>
              <th className="py-3.5 px-3">Progress</th>
              <th className="py-3.5 px-3">Fajr</th>
              <th className="py-3.5 px-3">Dhuhr</th>
              <th className="py-3.5 px-3">Asr</th>
              <th className="py-3.5 px-3">Maghrib</th>
              <th className="py-3.5 px-3">Isha</th>
              <th className="py-3.5 px-3 text-center">Quran</th>
              <th className="py-3.5 px-3 text-center">Adhkar</th>
              <th className="py-3.5 px-3 text-center">Q + Meaning</th>
              <th className="py-3.5 px-4 text-right">Overall</th>
              <th className="py-3.5 px-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-8 text-center text-gray-400">
                  No members found.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => {
                const user = m.user || { id: 'unknown', name: 'Member', email: '', avatarUrl: '' };
                const rec = m.todayRecord || {
                  prayers: { fajr: 'no', dhuhr: 'no', asr: 'no', maghrib: 'no', isha: 'no' },
                  habits: { quran: false, morningAdhkar: false, eveningAdhkar: false, quranMeaning: false },
                  completionRate: 0,
                };

                const prayers = rec.prayers || { fajr: 'no', dhuhr: 'no', asr: 'no', maghrib: 'no', isha: 'no' };
                const habits = rec.habits || { quran: false, morningAdhkar: false, eveningAdhkar: false, quranMeaning: false };
                const adhkarDone = habits.morningAdhkar && habits.eveningAdhkar;

                return (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/members/${user.id}`}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium">{user.email}</p>
                        </div>
                      </Link>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-emerald-600 h-1.5 rounded-full"
                            style={{ width: `${m.todayProgress || 0}%` }}
                          />
                        </div>
                        <span>{m.todayProgress || 0}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">{renderStatusSymbol(prayers.fajr)}</td>
                    <td className="py-3.5 px-3">{renderStatusSymbol(prayers.dhuhr)}</td>
                    <td className="py-3.5 px-3">{renderStatusSymbol(prayers.asr)}</td>
                    <td className="py-3.5 px-3">{renderStatusSymbol(prayers.maghrib)}</td>
                    <td className="py-3.5 px-3">{renderStatusSymbol(prayers.isha)}</td>

                    <td className="py-3.5 px-3 text-center">
                      {habits.quran ? (
                        <span className="text-emerald-700 font-bold">✓</span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {adhkarDone ? (
                        <span className="text-emerald-700 font-bold">✓ Both</span>
                      ) : habits.morningAdhkar || habits.eveningAdhkar ? (
                        <span className="text-amber-700 font-semibold">Partial</span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {habits.quranMeaning ? (
                        <span className="text-emerald-700 font-bold">✓</span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-extrabold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                        {m.weeklyAvg || 0}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/admin/members/${user.id}`}
                        className="p-1 text-gray-400 hover:text-gray-900 inline-block"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
