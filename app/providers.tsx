'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';
export type VoiceType = 'male' | 'female' | 'neutral';

interface UserSettings {
  theme: Theme;
  voice: VoiceType;
  notificationsEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  hapticsEnabled: boolean;
}

interface Conversation {
  id: string;
  category: string;
  messages: Message[];
  timestamp: Date;
  title: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  voiceEnabled?: boolean;
}

interface AppContextType {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  conversations: Conversation[];
  addConversation: (conversation: Conversation) => void;
  deleteConversation: (id: string) => void;
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addMessage: (message: Message) => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function Providers({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'light',
    voice: 'neutral',
    notificationsEnabled: true,
    fontSize: 'medium',
    hapticsEnabled: true,
  });

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('userSettings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }

    const storedConvos = localStorage.getItem('conversations');
    if (storedConvos) {
      const parsed = JSON.parse(storedConvos);
      setConversations(parsed.map((c: any) => ({
        ...c,
        timestamp: new Date(c.timestamp),
        messages: c.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      })));
    }
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('userSettings', JSON.stringify(updated));
      return updated;
    });
  };

  const addConversation = (conversation: Conversation) => {
    setConversations((prev) => {
      const updated = [conversation, ...prev];
      localStorage.setItem('conversations', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('conversations', JSON.stringify(updated));
      return updated;
    });
  };

  const addMessage = (message: Message) => {
    if (currentConversation) {
      const updated = {
        ...currentConversation,
        messages: [...currentConversation.messages, message],
      };
      setCurrentConversation(updated);

      setConversations((prev) => {
        const filtered = prev.filter((c) => c.id !== currentConversation.id);
        const newConvos = [updated, ...filtered];
        localStorage.setItem('conversations', JSON.stringify(newConvos));
        return newConvos;
      });
    }
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!settings.hapticsEnabled) return;

    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30,
      };
      navigator.vibrate(patterns[type]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        conversations,
        addConversation,
        deleteConversation,
        currentConversation,
        setCurrentConversation,
        addMessage,
        triggerHaptic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within a Providers');
  }
  return context;
}
