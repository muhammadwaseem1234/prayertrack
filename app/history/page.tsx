'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { HistoryTable } from '../../components/history/HistoryTable';
import { getCurrentUser, getActivityHistory } from '../../lib/dataService';
import { DailyRecord } from '../../types';
import { Calendar, Filter, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function HistoryPage() {
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [filterRange, setFilterRange] = useState<'30' | '14' | '7'>('30');

  const currentUser = getCurrentUser();

  useEffect(() => {
    const data = getActivityHistory(currentUser.id);
    setHistory(data);
  }, [currentUser.id]);

  const filteredHistory = history.slice(0, parseInt(filterRange, 10));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">History Log</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Review your previous daily worship records and completion trends.
            </p>
          </div>

          {/* Date Filter & Actions */}
          <div className="flex items-center gap-2">
            <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 text-xs font-medium card-shadow">
              <button
                type="button"
                onClick={() => setFilterRange('7')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterRange === '7' ? 'bg-gray-900 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setFilterRange('14')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterRange === '14' ? 'bg-gray-900 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                14 Days
              </button>
              <button
                type="button"
                onClick={() => setFilterRange('30')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterRange === '30' ? 'bg-gray-900 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {/* History Table */}
        <HistoryTable records={filteredHistory} />
      </div>
    </AppLayout>
  );
}
