'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, TrendingUp, Sparkles, Heart, Leaf, Stethoscope, Laptop } from 'lucide-react';
import { useApp } from '@/app/providers';
import ChatInterface from './ChatInterface';

const trendingTopics = [
  { id: 1, title: 'Stress Management', category: 'Emotional Support', icon: Heart, color: 'primary' },
  { id: 2, title: 'Crop Disease Detection', category: 'Agriculture', icon: Leaf, color: 'secondary' },
  { id: 3, title: 'Sleep Health Tips', category: 'Health & Medical', icon: Stethoscope, color: 'primary' },
  { id: 4, title: 'Coding Best Practices', category: 'Tech', icon: Laptop, color: 'secondary' },
];

const suggestions = [
  'How can I manage anxiety?',
  'What are the best practices for organic farming?',
  'How do I improve my sleep quality?',
  'Explain machine learning basics',
];

export default function HomePage() {
  const { triggerHaptic, setCurrentConversation, addConversation } = useApp();
  const [showChat, setShowChat] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState('');

  const handleSuggestionClick = (suggestion: string) => {
    triggerHaptic('medium');
    setInitialPrompt(suggestion);
    startNewConversation('All', suggestion);
  };

  const startNewConversation = (category: string, prompt?: string) => {
    const newConversation = {
      id: Date.now().toString(),
      category,
      messages: [],
      timestamp: new Date(),
      title: prompt || 'New Conversation',
    };
    setCurrentConversation(newConversation);
    addConversation(newConversation);
    setShowChat(true);
  };

  const handleVoiceInput = () => {
    triggerHaptic('medium');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInitialPrompt(transcript);
        startNewConversation('All', transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} initialPrompt={initialPrompt} />;
  }

  return (
    <div className="min-h-full px-4 py-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Welcome Back!
        </h1>
        <p className="text-neutral-600">How can I assist you today?</p>
      </motion.div>

      {/* Voice Input Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onClick={handleVoiceInput}
        className="w-full mb-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-6 shadow-lg active:scale-95 transition-transform"
        aria-label="Start voice input"
      >
        <div className="flex items-center justify-center gap-3">
          <Mic size={28} />
          <span className="text-lg font-semibold">Tap to speak</span>
        </div>
      </motion.button>

      {/* Trending Topics */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
        aria-labelledby="trending-heading"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-primary-500" size={20} />
          <h2 id="trending-heading" className="text-xl font-bold text-neutral-900">
            Trending Topics
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {trendingTopics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                onClick={() => {
                  triggerHaptic('medium');
                  startNewConversation(topic.category, topic.title);
                }}
                className="card p-4 active:scale-95 transition-transform"
                aria-label={`Explore ${topic.title}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-${topic.color}-100 flex items-center justify-center mb-3`}
                >
                  <Icon className={`text-${topic.color}-500`} size={24} />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1 text-left">
                  {topic.title}
                </h3>
                <p className="text-xs text-neutral-500 text-left">{topic.category}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Personalized Suggestions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        aria-labelledby="suggestions-heading"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-secondary-500" size={20} />
          <h2 id="suggestions-heading" className="text-xl font-bold text-neutral-900">
            Personalized Suggestions
          </h2>
        </div>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              onClick={() => handleSuggestionClick(suggestion)}
              className="card w-full p-4 text-left active:scale-95 transition-transform"
              aria-label={`Ask: ${suggestion}`}
            >
              <p className="text-neutral-800 font-medium">{suggestion}</p>
            </motion.button>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
