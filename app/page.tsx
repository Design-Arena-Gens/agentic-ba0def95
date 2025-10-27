'use client';

import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import HomePage from '@/components/HomePage';
import CategoriesPage from '@/components/CategoriesPage';
import HistoryPage from '@/components/HistoryPage';
import SettingsPage from '@/components/SettingsPage';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'history' | 'settings'>('home');

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-neutral-50">
      <div className="flex-1 overflow-y-auto scrollbar-hide safe-area-top">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'categories' && <CategoriesPage />}
        {activeTab === 'history' && <HistoryPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}
