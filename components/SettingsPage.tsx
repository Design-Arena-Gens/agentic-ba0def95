'use client';

import { motion } from 'framer-motion';
import { Moon, Volume2, Bell, Type, Smartphone, ChevronRight } from 'lucide-react';
import { useApp } from '@/app/providers';

export default function SettingsPage() {
  const { settings, updateSettings, triggerHaptic } = useApp();

  const handleToggle = (key: keyof typeof settings) => {
    triggerHaptic('medium');
    updateSettings({ [key]: !(settings[key] as boolean) });
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    triggerHaptic('light');
    updateSettings({ fontSize: size });
    document.documentElement.style.fontSize =
      size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
  };

  const handleVoiceChange = (voice: 'male' | 'female' | 'neutral') => {
    triggerHaptic('light');
    updateSettings({ voice });
  };

  return (
    <div className="min-h-full px-4 py-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
        <p className="text-neutral-600">Customize your experience</p>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Appearance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card p-4"
          aria-labelledby="appearance-heading"
        >
          <h2 id="appearance-heading" className="text-lg font-semibold text-neutral-900 mb-4">
            Appearance
          </h2>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Moon className="text-primary-500" size={20} />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Dark Mode</p>
                <p className="text-sm text-neutral-500">Coming soon</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('theme' as any)}
              disabled
              className="w-12 h-7 bg-neutral-200 rounded-full relative transition-colors opacity-50"
              aria-label="Toggle dark mode (disabled)"
              aria-checked={settings.theme === 'dark'}
              role="switch"
            >
              <div className="w-5 h-5 bg-white rounded-full absolute top-1 left-1 transition-transform" />
            </button>
          </div>

          {/* Font Size */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                <Type className="text-secondary-500" size={20} />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Font Size</p>
                <p className="text-sm text-neutral-500">Adjust text size</p>
              </div>
            </div>
            <div className="flex gap-2 ml-13">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    settings.fontSize === size
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                  aria-label={`Set font size to ${size}`}
                  aria-pressed={settings.fontSize === size}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Voice & Sound */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-4"
          aria-labelledby="voice-heading"
        >
          <h2 id="voice-heading" className="text-lg font-semibold text-neutral-900 mb-4">
            Voice & Sound
          </h2>

          {/* Voice Type */}
          <div className="py-3 border-b border-neutral-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Volume2 className="text-primary-500" size={20} />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Voice Type</p>
                <p className="text-sm text-neutral-500">Select assistant voice</p>
              </div>
            </div>
            <div className="flex gap-2 ml-13">
              {(['male', 'female', 'neutral'] as const).map((voice) => (
                <button
                  key={voice}
                  onClick={() => handleVoiceChange(voice)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    settings.voice === voice
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                  aria-label={`Set voice to ${voice}`}
                  aria-pressed={settings.voice === voice}
                >
                  {voice.charAt(0).toUpperCase() + voice.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Haptics Toggle */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                <Smartphone className="text-secondary-500" size={20} />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Haptic Feedback</p>
                <p className="text-sm text-neutral-500">Vibration on interactions</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('hapticsEnabled')}
              className={`w-12 h-7 rounded-full relative transition-colors ${
                settings.hapticsEnabled ? 'bg-primary-500' : 'bg-neutral-300'
              }`}
              aria-label="Toggle haptic feedback"
              aria-checked={settings.hapticsEnabled}
              role="switch"
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                  settings.hapticsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-4"
          aria-labelledby="notifications-heading"
        >
          <h2 id="notifications-heading" className="text-lg font-semibold text-neutral-900 mb-4">
            Notifications
          </h2>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Bell className="text-primary-500" size={20} />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Push Notifications</p>
                <p className="text-sm text-neutral-500">Get updates and reminders</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('notificationsEnabled')}
              className={`w-12 h-7 rounded-full relative transition-colors ${
                settings.notificationsEnabled ? 'bg-primary-500' : 'bg-neutral-300'
              }`}
              aria-label="Toggle push notifications"
              aria-checked={settings.notificationsEnabled}
              role="switch"
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                  settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.section>

        {/* About */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card p-4"
          aria-labelledby="about-heading"
        >
          <h2 id="about-heading" className="text-lg font-semibold text-neutral-900 mb-4">
            About
          </h2>

          <button
            className="flex items-center justify-between w-full py-3 border-b border-neutral-200"
            onClick={() => triggerHaptic('light')}
            aria-label="View privacy policy"
          >
            <span className="font-medium text-neutral-900">Privacy Policy</span>
            <ChevronRight className="text-neutral-400" size={20} />
          </button>

          <button
            className="flex items-center justify-between w-full py-3 border-b border-neutral-200"
            onClick={() => triggerHaptic('light')}
            aria-label="View terms of service"
          >
            <span className="font-medium text-neutral-900">Terms of Service</span>
            <ChevronRight className="text-neutral-400" size={20} />
          </button>

          <button
            className="flex items-center justify-between w-full py-3"
            onClick={() => triggerHaptic('light')}
            aria-label="View app version"
          >
            <span className="font-medium text-neutral-900">Version</span>
            <span className="text-neutral-500">1.0.0</span>
          </button>
        </motion.section>
      </div>
    </div>
  );
}
