import { createClient } from '@supabase/supabase-js';
import { User, DailyRecord, MemberStats, GroupAnalytics, PrayerStatus, PrayerName, SpiritualHabits } from '../types';
import { MOCK_USERS, generateInitialRecords, getFormattedDate, calculateCompletionRate } from './mockData';

export { getFormattedDate };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-supabase-project') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length > 20
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

const RECORDS_STORAGE_KEY = 'prayertrack_daily_records_v1';
const CURRENT_USER_KEY = 'prayertrack_current_user_id';

// Helper to map DB row to DailyRecord
export function mapRowToDailyRecord(row: any, fallbackUserId: string = 'u1', fallbackDate: string = getFormattedDate(0)): DailyRecord {
  if (!row) {
    return {
      id: `rec_${fallbackUserId}_${fallbackDate}`,
      userId: fallbackUserId,
      date: fallbackDate,
      prayers: { fajr: 'no', dhuhr: 'no', asr: 'no', maghrib: 'no', isha: 'no' },
      habits: { quran: false, morningAdhkar: false, eveningAdhkar: false, quranMeaning: false },
      completionRate: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  const prayers = {
    fajr: (row.fajr as PrayerStatus) || 'no',
    dhuhr: (row.dhuhr as PrayerStatus) || 'no',
    asr: (row.asr as PrayerStatus) || 'no',
    maghrib: (row.maghrib as PrayerStatus) || 'no',
    isha: (row.isha as PrayerStatus) || 'no',
  };

  const habits = {
    quran: !!row.quran,
    morningAdhkar: !!row.morning_adhkar,
    eveningAdhkar: !!row.evening_adhkar,
    quranMeaning: !!row.quran_meaning,
  };

  const completionRate = row.completion_rate !== undefined && row.completion_rate !== null
    ? row.completion_rate
    : calculateCompletionRate(prayers, habits);

  return {
    id: row.id || `rec_${row.user_id}_${row.date}`,
    userId: row.user_id || fallbackUserId,
    date: row.date || fallbackDate,
    prayers,
    habits,
    notes: row.notes,
    completionRate,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

// Helper to convert DailyRecord into Supabase DB row format
export function mapDailyRecordToRow(record: DailyRecord) {
  return {
    user_id: record.userId,
    date: record.date,
    fajr: record.prayers.fajr,
    dhuhr: record.prayers.dhuhr,
    asr: record.prayers.asr,
    maghrib: record.prayers.maghrib,
    isha: record.prayers.isha,
    quran: record.habits.quran,
    morning_adhkar: record.habits.morningAdhkar,
    evening_adhkar: record.habits.eveningAdhkar,
    quran_meaning: record.habits.quranMeaning,
    completion_rate: record.completionRate,
    notes: record.notes,
    updated_at: new Date().toISOString(),
  };
}

// Sync logged-in Clerk user profile to Supabase profiles table
export async function syncUserProfile(user: {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role?: string;
}) {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('profiles').upsert(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatarUrl,
        role: user.role || 'member',
      },
      { onConflict: 'id' }
    );
  } catch (err) {
    console.warn('Profile sync error:', err);
  }
}

// Local storage fallback handlers
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

// User selection
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

export function getMembersSync(): User[] {
  return MOCK_USERS;
}

export async function getMembers(): Promise<User[]> {
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (data && !error && data.length > 0) {
        const dbMembers: User[] = data.map((p: Record<string, any>) => ({
          id: p.id,
          name: p.name || 'Member',
          email: p.email || '',
          avatarUrl: p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          role: (p.role as 'admin' | 'member') || 'member',
          joinedDate: p.created_at ? p.created_at.split('T')[0] : '2026-01-01',
          streakDays: 7,
        }));

        // Merge real Supabase users with mock users so group stays populated
        const dbIds = new Set(dbMembers.map((m) => m.id));
        const extraMockUsers = MOCK_USERS.filter((m) => !dbIds.has(m.id));
        return [...dbMembers, ...extraMockUsers];
      }
    } catch (err) {
      console.warn('Failed to fetch members from Supabase:', err);
    }
  }
  return MOCK_USERS;
}

// Synchronous fallback helper for local state
export function getDailyRecordSync(userId: string, dateStr: string = getFormattedDate(0)): DailyRecord {
  const records = getStoredRecords();
  let record = records.find((r) => r.userId === userId && r.date === dateStr);

  if (!record) {
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

// Fetch today activity from Supabase with graceful fallback
export async function getTodayActivity(userId: string): Promise<DailyRecord> {
  const todayStr = getFormattedDate(0);
  try {
    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', userId)
        .eq('date', todayStr)
        .maybeSingle();

      if (data && !error) {
        return mapRowToDailyRecord(data, userId, todayStr);
      }
    }
  } catch (err) {
    console.warn('Supabase fetch failed, using local records:', err);
  }

  return getDailyRecordSync(userId, todayStr);
}

// Update Prayer Status in Supabase with local fallback sync
export async function updatePrayerStatus(
  userId: string,
  dateStr: string,
  prayer: PrayerName,
  status: PrayerStatus
): Promise<DailyRecord> {
  const localTarget = getDailyRecordSync(userId, dateStr);
  const updatedPrayers = { ...localTarget.prayers, [prayer]: status };
  const newRate = calculateCompletionRate(updatedPrayers, localTarget.habits);

  const updatedRecord: DailyRecord = {
    ...localTarget,
    userId,
    date: dateStr,
    prayers: updatedPrayers,
    completionRate: newRate,
    updatedAt: new Date().toISOString(),
  };

  const records = getStoredRecords();
  const idx = records.findIndex((r) => r.userId === userId && r.date === dateStr);
  if (idx >= 0) records[idx] = updatedRecord;
  else records.push(updatedRecord);
  saveRecords(records);

  try {
    if (supabase && isSupabaseConfigured()) {
      const rowPayload = mapDailyRecordToRow(updatedRecord);
      const { data, error } = await supabase
        .from('daily_activities')
        .upsert(rowPayload, { onConflict: 'user_id,date' })
        .select()
        .maybeSingle();

      if (data && !error) {
        return mapRowToDailyRecord(data, userId, dateStr);
      }
    }
  } catch (err) {
    console.warn('Supabase upsert failed:', err);
  }

  return updatedRecord;
}

// Update Habit Status in Supabase with local fallback sync
export async function updateHabitStatus(
  userId: string,
  dateStr: string,
  habit: keyof SpiritualHabits,
  completed: boolean
): Promise<DailyRecord> {
  const localTarget = getDailyRecordSync(userId, dateStr);
  const updatedHabits = { ...localTarget.habits, [habit]: completed };
  const newRate = calculateCompletionRate(localTarget.prayers, updatedHabits);

  const updatedRecord: DailyRecord = {
    ...localTarget,
    userId,
    date: dateStr,
    habits: updatedHabits,
    completionRate: newRate,
    updatedAt: new Date().toISOString(),
  };

  const records = getStoredRecords();
  const idx = records.findIndex((r) => r.userId === userId && r.date === dateStr);
  if (idx >= 0) records[idx] = updatedRecord;
  else records.push(updatedRecord);
  saveRecords(records);

  try {
    if (supabase && isSupabaseConfigured()) {
      const rowPayload = mapDailyRecordToRow(updatedRecord);
      const { data, error } = await supabase
        .from('daily_activities')
        .upsert(rowPayload, { onConflict: 'user_id,date' })
        .select()
        .maybeSingle();

      if (data && !error) {
        return mapRowToDailyRecord(data, userId, dateStr);
      }
    }
  } catch (err) {
    console.warn('Supabase habit upsert failed:', err);
  }

  return updatedRecord;
}

// Activity History from Supabase / Local
export async function getActivityHistory(userId: string): Promise<DailyRecord[]> {
  try {
    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (data && data.length > 0 && !error) {
        return data.map((r: Record<string, any>) => mapRowToDailyRecord(r, userId, r.date));
      }
    }
  } catch (err) {
    console.warn('Supabase history fetch failed:', err);
  }

  const records = getStoredRecords();
  return records
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Member Stats for Admin View
export async function getMemberStats(userId: string, userOverride?: User): Promise<MemberStats> {
  const members = await getMembers();
  const user = userOverride || members.find((u) => u.id === userId) || MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
  const history = await getActivityHistory(userId);
  const todayRecord = await getTodayActivity(userId);

  const prayers = todayRecord.prayers || { fajr: 'no', dhuhr: 'no', asr: 'no', maghrib: 'no', isha: 'no' };
  const habits = todayRecord.habits || { quran: false, morningAdhkar: false, eveningAdhkar: false, quranMeaning: false };

  const prayersCompleted = Object.values(prayers).filter(
    (s) => s === 'yes' || s === 'jamaah'
  ).length;

  const habitsCompleted = Object.values(habits).filter(Boolean).length;

  const last7 = history.slice(0, 7);
  const weeklyAvg = Math.round(
    last7.reduce((acc, r) => acc + (r.completionRate || 0), 0) / (last7.length || 1)
  );

  const monthlyAvg = Math.round(
    history.reduce((acc, r) => acc + (r.completionRate || 0), 0) / (history.length || 1)
  );

  return {
    user,
    todayProgress: todayRecord.completionRate || 0,
    prayersCompleted,
    habitsCompleted,
    weeklyAvg,
    monthlyAvg,
    streakDays: user.streakDays || 1,
    todayRecord,
  };
}

export async function getAllMembersStats(): Promise<MemberStats[]> {
  const members = await getMembers();
  return Promise.all(members.map((u) => getMemberStats(u.id, u)));
}

// Compute group aggregate analytics
export async function getGroupAnalytics(): Promise<GroupAnalytics> {
  const allStats = await getAllMembersStats();
  const totalMembers = allStats.length || 1;

  const todayRecords = allStats.map((s) => s.todayRecord);
  const overallCompletion = Math.round(
    todayRecords.reduce((acc, r) => acc + (r.completionRate || 0), 0) / (todayRecords.length || 1)
  );

  const prayerCounts = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
  todayRecords.forEach((r) => {
    const prayers = r.prayers || { fajr: 'no', dhuhr: 'no', asr: 'no', maghrib: 'no', isha: 'no' };
    (Object.keys(prayerCounts) as PrayerName[]).forEach((p) => {
      if (prayers[p] === 'yes' || prayers[p] === 'jamaah') {
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

  const habitCounts = { quran: 0, morningAdhkar: 0, eveningAdhkar: 0, quranMeaning: 0 };
  todayRecords.forEach((r) => {
    const habits = r.habits || { quran: false, morningAdhkar: false, eveningAdhkar: false, quranMeaning: false };
    (Object.keys(habitCounts) as (keyof SpiritualHabits)[]).forEach((h) => {
      if (habits[h]) habitCounts[h] += 1;
    });
  });

  const habitPercentages = {
    quran: Math.round((habitCounts.quran / totalMembers) * 100),
    morningAdhkar: Math.round((habitCounts.morningAdhkar / totalMembers) * 100),
    eveningAdhkar: Math.round((habitCounts.eveningAdhkar / totalMembers) * 100),
    quranMeaning: Math.round((habitCounts.quranMeaning / totalMembers) * 100),
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  let groupDailyRecords: DailyRecord[] = [];
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('daily_activities')
        .select('*')
        .order('date', { ascending: false });

      if (data && !error) {
        groupDailyRecords = data.map((r: Record<string, any>) => mapRowToDailyRecord(r, r.user_id, r.date));
      }
    } catch (err) {
      console.warn('Failed to fetch group activities from Supabase:', err);
    }
  }

  if (groupDailyRecords.length === 0) {
    groupDailyRecords = getStoredRecords();
  }

  const weeklyScores = [];
  for (let i = 6; i >= 0; i--) {
    const dStr = getFormattedDate(i);
    const dateObj = new Date(dStr);
    const dayName = daysOfWeek[(dateObj.getDay() + 6) % 7];
    const dayRecs = groupDailyRecords.filter((r) => r.date === dStr);
    const avg = Math.round(
      dayRecs.reduce((acc, r) => acc + (r.completionRate || 0), 0) / (dayRecs.length || 1)
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
