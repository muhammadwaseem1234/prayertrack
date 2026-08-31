import { User, DailyRecord, PrayerStatus, PrayerState, SpiritualHabits } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Waseem Akram',
    email: 'waseem@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'member',
    joinedDate: '2026-01-15',
    streakDays: 14,
  },
  {
    id: 'u2',
    name: 'Muhammad Hassan',
    email: 'muhammad@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'admin',
    joinedDate: '2026-01-01',
    streakDays: 28,
  },
  {
    id: 'u3',
    name: 'Tariq Al-Mansoor',
    email: 'tariq@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'member',
    joinedDate: '2026-02-01',
    streakDays: 9,
  },
  {
    id: 'u4',
    name: 'Bilal Siddiqui',
    email: 'bilal@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    role: 'member',
    joinedDate: '2026-01-10',
    streakDays: 21,
  },
  {
    id: 'u5',
    name: 'Omar Farooq',
    email: 'omar@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    role: 'member',
    joinedDate: '2026-02-10',
    streakDays: 5,
  },
  {
    id: 'u6',
    name: 'Hamza Malik',
    email: 'hamza@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    role: 'member',
    joinedDate: '2026-01-20',
    streakDays: 18,
  },
  {
    id: 'u7',
    name: 'Zain Abideen',
    email: 'zain@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    role: 'member',
    joinedDate: '2026-02-05',
    streakDays: 11,
  },
  {
    id: 'u8',
    name: 'Yusuf Raza',
    email: 'yusuf@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    role: 'member',
    joinedDate: '2026-02-12',
    streakDays: 3,
  },
  {
    id: 'u9',
    name: 'Saad Ibrahim',
    email: 'saad@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    role: 'member',
    joinedDate: '2026-01-25',
    streakDays: 16,
  },
  {
    id: 'u10',
    name: 'Ibrahim Khan',
    email: 'ibrahim@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    role: 'member',
    joinedDate: '2026-02-15',
    streakDays: 7,
  },
];

// Helper to format date string YYYY-MM-DD offset from today
export function getFormattedDate(daysOffset: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysOffset);
  return d.toISOString().split('T')[0];
}

// Calculate completion score for a record
export function calculateCompletionRate(
  prayers: PrayerState,
  habits: SpiritualHabits
): number {
  let completedPoints = 0;
  // 5 prayers: jamaah = 1, yes = 1, delayed = 0.5, no = 0
  const prayerKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
  prayerKeys.forEach((p) => {
    const val = prayers[p];
    if (val === 'jamaah' || val === 'yes') completedPoints += 1;
    else if (val === 'delayed') completedPoints += 0.5;
  });

  // 4 habits: 1 point each
  const habitKeys = ['quran', 'morningAdhkar', 'eveningAdhkar', 'quranMeaning'] as const;
  habitKeys.forEach((h) => {
    if (habits[h]) completedPoints += 1;
  });

  // Total possible = 9 points
  return Math.round((completedPoints / 9) * 100);
}

// Generate 30 days of deterministic records for all 10 users
export function generateInitialRecords(): DailyRecord[] {
  const records: DailyRecord[] = [];
  const todayStr = getFormattedDate(0);

  MOCK_USERS.forEach((user, uIdx) => {
    for (let day = 0; day < 30; day++) {
      const dateStr = getFormattedDate(day);
      const isToday = day === 0;

      // Seed deterministic patterns based on user index and day
      const baseSeed = (uIdx * 7 + day * 13) % 100;

      let fajr: PrayerStatus = baseSeed > 25 ? 'jamaah' : baseSeed > 10 ? 'yes' : baseSeed > 5 ? 'delayed' : 'no';
      let dhuhr: PrayerStatus = baseSeed > 20 ? 'jamaah' : baseSeed > 8 ? 'yes' : 'delayed';
      let asr: PrayerStatus = baseSeed > 35 ? 'yes' : baseSeed > 15 ? 'jamaah' : 'delayed';
      let maghrib: PrayerStatus = baseSeed > 10 ? 'jamaah' : 'yes';
      let isha: PrayerStatus = baseSeed > 30 ? 'jamaah' : baseSeed > 12 ? 'yes' : 'delayed';

      // For Waseem (u1 today), specific values requested in prompt
      if (user.id === 'u1' && isToday) {
        fajr = 'jamaah';
        dhuhr = 'yes';
        asr = 'delayed';
        maghrib = 'no';
        isha = 'yes';
      }

      // For Muhammad (u2 today - admin overview example)
      if (user.id === 'u2' && isToday) {
        fajr = 'jamaah';
        dhuhr = 'jamaah';
        asr = 'delayed';
        maghrib = 'jamaah';
        isha = 'yes';
      }

      const quran = (baseSeed + uIdx) % 3 !== 0;
      const morningAdhkar = (baseSeed + day) % 4 !== 0;
      const eveningAdhkar = (baseSeed + uIdx + day) % 2 === 0;
      const quranMeaning = (baseSeed + uIdx) % 5 > 1;

      const prayers = { fajr, dhuhr, asr, maghrib, isha };
      const habits = { quran, morningAdhkar, eveningAdhkar, quranMeaning };

      const completionRate = calculateCompletionRate(prayers, habits);

      records.push({
        id: `rec_${user.id}_${dateStr}`,
        userId: user.id,
        date: dateStr,
        prayers,
        habits,
        notes: isToday ? 'Focus on Khushoo during Asr & Maghrib' : undefined,
        completionRate,
        updatedAt: new Date(Date.now() - day * 86400000).toISOString(),
      });
    }
  });

  return records;
}
