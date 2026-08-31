'use client';

import React, { useState } from 'react';
import { PrayerName, PrayerStatus } from '../../types';
import { Check, CheckCheck, Clock, X, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface PrayerRowProps {
  name: PrayerName;
  displayName: string;
  timeLabel: string;
  status: PrayerStatus;
  onStatusChange: (status: PrayerStatus) => void;
}

export const PrayerRow: React.FC<PrayerRowProps> = ({
  name,
  displayName,
  timeLabel,
  status,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusConfigs: Record<
    PrayerStatus,
    { label: string; icon: React.FC<{ className?: string }>; badgeVariant: 'jamaah' | 'yes' | 'delayed' | 'no' }
  > = {
    jamaah: { label: 'Prayed with Jamaah', icon: CheckCheck, badgeVariant: 'jamaah' },
    yes: { label: 'Prayed', icon: Check, badgeVariant: 'yes' },
    delayed: { label: 'Delayed', icon: Clock, badgeVariant: 'delayed' },
    no: { label: 'Missed', icon: X, badgeVariant: 'no' },
  };

  const currentConfig = statusConfigs[status];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="border-b border-gray-100 last:border-0 py-3.5">
      <div className="flex items-center justify-between">
        {/* Left: Prayer name & standard time context */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              status === 'jamaah'
                ? 'bg-emerald-100/90 text-emerald-800'
                : status === 'yes'
                ? 'bg-emerald-50 text-emerald-700'
                : status === 'delayed'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            <CurrentIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 capitalize">{displayName}</h4>
            <p className="text-xs text-gray-400 font-medium">{timeLabel}</p>
          </div>
        </div>

        {/* Right: Current status & quick action selector toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200/80 hover:bg-gray-50 text-xs font-medium transition-all cursor-pointer"
          >
            <Badge prayerStatus={status}>{currentConfig.label}</Badge>
            <ChevronRight
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-90' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expanded status selector panel */}
      {isOpen && (
        <div className="mt-3 p-2 bg-gray-50/90 rounded-xl border border-gray-200/60 grid grid-cols-2 sm:grid-cols-4 gap-1.5 animate-in fade-in duration-150">
          <button
            type="button"
            onClick={() => {
              onStatusChange('jamaah');
              setIsOpen(false);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              status === 'jamaah'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Jamaah</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onStatusChange('yes');
              setIsOpen(false);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              status === 'yes'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Prayed</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onStatusChange('delayed');
              setIsOpen(false);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              status === 'delayed'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Delayed</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onStatusChange('no');
              setIsOpen(false);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              status === 'no'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <X className="w-3.5 h-3.5" />
            <span>Missed</span>
          </button>
        </div>
      )}
    </div>
  );
};
