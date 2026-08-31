import { User, DailyRecord, MemberStats, GroupAnalytics, PrayerStatus, PrayerName, SpiritualHabits } from '../types';
import { MOCK_USERS, generateInitialRecords, getFormattedDate, calculateCompletionRate } from './mockData';

export { getFormattedDate };

const RECORDS_STORAGE_KEY = 'prayertrack_daily_records_v1';
const CURRENT_USER_KEY = 'prayertrack_current_user_id';

// Initialize or fetch records from LocalStorage / memory
export function getStoredRecords(): DailyRecord[] {
  if (typeof window === 'undefined') {
    return generateInitialRecords();
  }
  
  const raw = localStorage.getItem(RECORDS_STORAGE_KEY);
  if (!raw) {
    const initial = generateInitialRecords();
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored records', err);
    const initial = generateInitialRecords();
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

export function saveRecords(records: DailyRecord[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
  }
}

// Current User selection (Waseem or Admin)
export function getCurrentUserId(): string {
  if (typeof window === 'undefined') return 'u1';
  return localStorage.getItem(CURRENT_USER_KEY) || 'u1';
}

export function setCurrentUserId(userId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  }
}

export function getCurrentUser(): User {
  const currentId = getCurrentUserId();
  return MOCK_USERS.find((u) => u.id === currentId) || MOCK_USERS[0];
}

export function getMembers(): User[] {
  return MOCK_USERS;
}

// Get user record for specific date
export function getDailyRecord(userId: string, dateStr: string = getFormattedDate(0)): DailyRecord {
  const records = getStoredRecords();
  let record = records.find((r) => r.userId === userId && r.date === dateStr);

  if (!record) {
    // Create new blank record for today if missing
    record = {
      id: `rec_${userId}_${dateStr}`,
      userId,
      date: dateStr,
      prayers: { fajr: 'no', dhuhr: 'no', asr: 'no', maghrib: 'no', isha: 'no' },
      habits: { quran: false, morningAdhkar: false, eveningAdhkar: false, quranMeaning: false },
      completionRate: 0,
      updatedAt: new Date().toISOString(),
    };
    records.push(record);
    saveRecords(records);
  }

  return record;
}

export function getTodayActivity(userId: string): DailyRecord {
  return getDailyRecord(userId, getFormattedDate(0));
}

export function getActivityHistory(userId: string): DailyRecord[] {
  const records = getStoredRecords();
  return records
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function updatePrayerStatus(
  userId: string,
  dateStr: string,
  prayer: PrayerName,
  status: PrayerStatus
): DailyRecord {
  const records = getStoredRecords();
  const index = records.findIndex((r) => r.userId === userId && r.date === dateStr);
  const target = index >= 0 ? records[index] : getDailyRecord(userId, dateStr);

  const updatedPrayers = {
    ...target.prayers,
    [prayer]: status,
  };

  const newCompletionRate = calculateCompletionRate(updatedPrayers, target.habits);

  const updatedRecord: DailyRecord = {
    ...target,
    prayers: updatedPrayers,
    completionRate: newCompletionRate,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    records[index] = updatedRecord;
  } else {
    records.push(updatedRecord);
  }

  saveRecords(records);
  return updatedRecord;
}

export function updateHabitStatus(
  userId: string,
  dateStr: string,
  habit: keyof SpiritualHabits,
  completed: boolean
): DailyRecord {
  const records = getStoredRecords();
  const index = records.findIndex((r) => r.userId === userId && r.date === dateStr);
  const target = index >= 0 ? records[index] : getDailyRecord(userId, dateStr);

  const updatedHabits = {
    ...target.habits,
    [habit]: completed,
  };

  const newCompletionRate = calculateCompletionRate(target.prayers, updatedHabits);

  const updatedRecord: DailyRecord = {
    ...target,
    habits: updatedHabits,
    completionRate: newCompletionRate,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    records[index] = updatedRecord;
  } else {
    records.push(updatedRecord);
  }

  saveRecords(records);
  return updatedRecord;
}

// Calculate individual member stats for Admin view
export function getMemberStats(userId: string): MemberStats {
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
  const history = getActivityHistory(userId);
  const todayRecord = getTodayActivity(userId);

  // Count completed prayers today
  const prayersCompleted = Object.values(todayRecord.prayers).filter(
    (s) => s === 'yes' || s === 'jamaah'
  ).length;

  // Count habits completed today
  const habitsCompleted = Object.values(todayRecord.habits).filter(Boolean).length;

  // Weekly average (last 7 days)
  const last7 = history.slice(0, 7);
  const weeklyAvg = Math.round(
    last7.reduce((acc, r) => acc + r.completionRate, 0) / (last7.length || 1)
  );

  // Monthly average (last 30 days)
  const monthlyAvg = Math.round(
    history.reduce((acc, r) => acc + r.completionRate, 0) / (history.length || 1)
  );

  return {
    user,
    todayProgress: todayRecord.completionRate,
    prayersCompleted,
    habitsCompleted,
    weeklyAvg,
    monthlyAvg,
    streakDays: user.streakDays,
    todayRecord,
  };
}

export function getAllMembersStats(): MemberStats[] {
  return MOCK_USERS.map((u) => getMemberStats(u.id));
}

// Compute group aggregate analytics
export function getGroupAnalytics(): GroupAnalytics {
  const records = getStoredRecords();
  const todayStr = getFormattedDate(0);
  const todayRecords = records.filter((r) => r.date === todayStr);

  const totalMembers = MOCK_USERS.length;

  // Overall today completion
  const overallCompletion = Math.round(
    todayRecords.reduce((acc, r) => acc + r.completionRate, 0) / (todayRecords.length || 1)
  );

  // Prayer percentages
  const prayerCounts = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
  todayRecords.forEach((r) => {
    (Object.keys(prayerCounts) as PrayerName[]).forEach((p) => {
      if (r.prayers[p] === 'yes' || r.prayers[p] === 'jamaah') {
        prayerCounts[p] += 1;
      }
    });
  });

  const prayerPercentages = {
    fajr: Math.round((prayerCounts.fajr / totalMembers) * 100),
    dhuhr: Math.round((prayerCounts.dhuhr / totalMembers) * 100),
    asr: Math.round((prayerCounts.asr / totalMembers) * 100),
    maghrib: Math.round((prayerCounts.maghrib / totalMembers) * 100),
    isha: Math.round((prayerCounts.isha / totalMembers) * 100),
  };

  // Habit percentages
  const habitCounts = { quran: 0, morningAdhkar: 0, eveningAdhkar: 0, quranMeaning: 0 };
  todayRecords.forEach((r) => {
    (Object.keys(habitCounts) as (keyof SpiritualHabits)[]).forEach((h) => {
      if (r.habits[h]) habitCounts[h] += 1;
    });
  });

  const habitPercentages = {
    quran: Math.round((habitCounts.quran / totalMembers) * 100),
    morningAdhkar: Math.round((habitCounts.morningAdhkar / totalMembers) * 100),
    eveningAdhkar: Math.round((habitCounts.eveningAdhkar / totalMembers) * 100),
    quranMeaning: Math.round((habitCounts.quranMeaning / totalMembers) * 100),
  };

  // 7-day weekly scores across group
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyScores = [];
  for (let i = 6; i >= 0; i--) {
    const dStr = getFormattedDate(i);
    const dateObj = new Date(dStr);
    const dayName = daysOfWeek[(dateObj.getDay() + 6) % 7];
    const dayRecs = records.filter((r) => r.date === dStr);
    const avg = Math.round(
      dayRecs.reduce((acc, r) => acc + r.completionRate, 0) / (dayRecs.length || 1)
    );
    weeklyScores.push({
      day: dayName,
      date: dStr,
      completion: avg || 75,
    });
  }

  return {
    totalMembers,
    overallCompletion,
    prayerPercentages,
    habitPercentages,
    weeklyScores,
  };
}
