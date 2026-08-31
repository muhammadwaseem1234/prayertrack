import React from 'react';
import { PrayerStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'emerald' | 'amber' | 'red' | 'gray' | 'prayer';
  prayerStatus?: PrayerStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  prayerStatus,
  className = '',
}) => {
  let styleClasses = 'bg-gray-100 text-gray-700 border-gray-200';

  if (prayerStatus) {
    switch (prayerStatus) {
      case 'jamaah':
        styleClasses = 'bg-emerald-100/80 text-emerald-800 border-emerald-200 font-medium';
        break;
      case 'yes':
        styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/60 font-medium';
        break;
      case 'delayed':
        styleClasses = 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
        break;
      case 'no':
        styleClasses = 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
        break;
    }
  } else {
    switch (variant) {
      case 'emerald':
        styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'amber':
        styleClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'red':
        styleClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'gray':
        styleClasses = 'bg-gray-100 text-gray-600 border-gray-200';
        break;
      default:
        styleClasses = 'bg-gray-900 text-white border-transparent';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border font-medium transition-colors ${styleClasses} ${className}`}
    >
      {children}
    </span>
  );
};
