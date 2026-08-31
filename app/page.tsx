'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, HeartHandshake, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-page text-gray-900 flex flex-col font-sans">
      {/* Navbar */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">PrayerTrack</span>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            Launch App
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-8">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Private Friends Worship Tracker</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
          Stay consistent. <br />
          <span className="text-gray-500">Track your day, one prayer at a time.</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
          PrayerTrack is a private, disciplined activity tracker designed for close friends to record daily prayers, Quran recitation, and Adhkar remembrances together.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8 py-3.5">
              <span>Continue to PrayerTrack</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 card-shadow">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">5 Daily Prayers</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Track Fajr, Dhuhr, Asr, Maghrib, and Isha with 4 distinct states: Prayed, Jamaah, Delayed, or Missed.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 card-shadow">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 mb-4">
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Spiritual Habits</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Record Quran recitation, Morning & Evening Adhkar, and deep study with Quran translation.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 card-shadow">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Admin Dashboard</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Empower group admins to monitor member consistency, review activity tables, and view group analytics.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        PrayerTrack &copy; 2026. Built with Next.js & Tailwind CSS.
      </footer>
    </div>
  );
}
