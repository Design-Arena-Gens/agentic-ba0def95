'use client';

import { Home, Grid, History, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/app/providers';

interface BottomNavProps {
  activeTab: 'home' | 'categories' | 'history' | 'settings';
  onTabChange: (tab: 'home' | 'categories' | 'history' | 'settings') => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { triggerHaptic } = useApp();

  const handleTabClick = (tab: 'home' | 'categories' | 'history' | 'settings') => {
    triggerHaptic('light');
    onTabChange(tab);
  };

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'categories' as const, label: 'Categories', icon: Grid },
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      className="bg-white border-t border-neutral-200 safe-area-bottom"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`nav-item ${isActive ? 'nav-item-active' : ''} flex-1 py-2`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
