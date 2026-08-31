'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { PrayerRow } from './PrayerRow';
import { DailyRecord, PrayerName, PrayerStatus } from '../../types';

interface PrayerTrackerCardProps {
  record: DailyRecord;
  onUpdatePrayer: (prayer: PrayerName, status: PrayerStatus) => void;
}

export const PrayerTrackerCard: React.FC<PrayerTrackerCardProps> = ({
  record,
  onUpdatePrayer,
}) => {
  const prayers: { name: PrayerName; displayName: string; timeLabel: string }[] = [
    { name: 'fajr', displayName: 'Fajr', timeLabel: 'Dawn Prayer' },
    { name: 'dhuhr', displayName: 'Dhuhr', timeLabel: 'Noon Prayer' },
    { name: 'asr', displayName: 'Asr', timeLabel: 'Afternoon Prayer' },
    { name: 'maghrib', displayName: 'Maghrib', timeLabel: 'Sunset Prayer' },
    { name: 'isha', displayName: 'Isha', timeLabel: 'Night Prayer' },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div>
          <CardTitle>Today's Prayers</CardTitle>
          <CardDescription>Keep track of your five daily prayers.</CardDescription>
        </div>
      </CardHeader>

      <div className="divide-y divide-gray-100">
        {prayers.map((p) => (
          <PrayerRow
            key={p.name}
            name={p.name}
            displayName={p.displayName}
            timeLabel={p.timeLabel}
            status={record.prayers[p.name]}
            onStatusChange={(newStatus) => onUpdatePrayer(p.name, newStatus)}
          />
        ))}
      </div>
    </Card>
  );
};
