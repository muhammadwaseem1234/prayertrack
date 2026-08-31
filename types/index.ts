export type PrayerStatus = 'yes' | 'no' | 'delayed' | 'jamaah';

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerState {
  fajr: PrayerStatus;
  dhuhr: PrayerStatus;
  asr: PrayerStatus;
  maghrib: PrayerStatus;
  isha: PrayerStatus;
}

export interface SpiritualHabits {
  quran: boolean;
  morningAdhkar: boolean;
  eveningAdhkar: boolean;
  quranMeaning: boolean;
}

export interface DailyRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  prayers: PrayerState;
  habits: SpiritualHabits;
  notes?: string;
  completionRate: number; // percentage 0-100
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'admin' | 'member';
  joinedDate: string;
  streakDays: number;
}

export interface MemberStats {
  user: User;
  todayProgress: number; // percentage 0-100
  prayersCompleted: number; // out of 5
  habitsCompleted: number; // out of 4
  weeklyAvg: number; // percentage
  monthlyAvg: number; // percentage
  streakDays: number;
  todayRecord: DailyRecord;
}

export interface GroupAnalytics {
  totalMembers: number;
  overallCompletion: number;
  prayerPercentages: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  habitPercentages: {
    quran: number;
    morningAdhkar: number;
    eveningAdhkar: number;
    quranMeaning: number;
  };
  weeklyScores: {
    day: string;
    date: string;
    completion: number;
  }[];
}
