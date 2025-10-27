'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Mic, Volume2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '@/app/providers';

interface ChatInterfaceProps {
  onBack: () => void;
  initialPrompt?: string;
}

export default function ChatInterface({ onBack, initialPrompt }: ChatInterfaceProps) {
  const { currentConversation, addMessage, triggerHaptic, settings } = useApp();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses: { [key: string]: string[] } = {
      emotional: [
        "I understand how you're feeling. It's completely normal to experience these emotions. Let's work through this together. Have you tried any breathing exercises?",
        "Your feelings are valid. Remember that it's okay to take things one step at a time. What specific aspect would you like to focus on first?",
        "Thank you for sharing that with me. Emotional wellness is a journey. Here are some strategies that might help...",
      ],
      agriculture: [
        "Based on current agricultural best practices, I'd recommend crop rotation to maintain soil health. What's your current growing season?",
        "For sustainable farming, consider implementing integrated pest management. This approach combines biological, cultural, and chemical methods...",
        "Organic farming techniques can significantly improve your yield. Let me explain the key principles...",
      ],
      health: [
        "Your health is important. While I can provide general information, please consult a healthcare professional for personalized advice. That said, here's what I can share...",
        "Maintaining a balanced lifestyle involves proper nutrition, regular exercise, and adequate sleep. Let's break this down...",
        "Prevention is key to good health. Here are some evidence-based recommendations...",
      ],
      tech: [
        "That's a great question about technology! Let me explain the concept step by step...",
        "In modern software development, best practices include clean code, proper documentation, and thorough testing. Here's how to apply this...",
        "The technology landscape is constantly evolving. Here's what you need to know about this topic...",
      ],
    };

    const category = currentConversation?.category.toLowerCase() || 'all';
    let categoryResponses = responses[category] || [
      "That's an interesting question! Let me provide you with a comprehensive answer based on the latest information...",
      "I'm here to help! Here's what I can tell you about that...",
      "Great question! Let me break this down for you in a clear and helpful way...",
    ];

    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    triggerHaptic('medium');
    setInput('');
    setIsLoading(true);

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: messageText,
      timestamp: new Date(),
    };

    addMessage(userMessage);

    const response = await generateAIResponse(messageText);

    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: response,
      timestamp: new Date(),
    };

    addMessage(assistantMessage);
    setIsLoading(false);
  };

  const handleVoiceInput = () => {
    triggerHaptic('medium');

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const handleTextToSpeech = (text: string) => {
    triggerHaptic('light');

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;

      const voices = speechSynthesis.getVoices();
      if (settings.voice === 'male') {
        utterance.voice = voices.find((v) => v.name.includes('Male')) || voices[0];
      } else if (settings.voice === 'female') {
        utterance.voice = voices.find((v) => v.name.includes('Female')) || voices[1];
      }

      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-neutral-200 px-4 py-4 safe-area-top"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              triggerHaptic('light');
              onBack();
            }}
            className="p-2 -ml-2 active:scale-95 transition-transform"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-neutral-900">
              {currentConversation?.category || 'Chat'}
            </h1>
            <p className="text-xs text-neutral-500">
              {currentConversation?.messages.length || 0} messages
            </p>
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide">
        <AnimatePresence>
          {currentConversation?.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary-500 text-white rounded-2xl rounded-tr-sm'
                    : 'bg-white text-neutral-900 rounded-2xl rounded-tl-sm border border-neutral-200'
                } px-4 py-3`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div
                  className={`flex items-center gap-2 mt-2 text-xs ${
                    message.role === 'user' ? 'text-primary-100' : 'text-neutral-500'
                  }`}
                >
                  <time dateTime={message.timestamp.toISOString()}>
                    {format(message.timestamp, 'p')}
                  </time>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => handleTextToSpeech(message.content)}
                      className="p-1 hover:bg-neutral-100 rounded active:scale-95 transition-transform"
                      aria-label="Read message aloud"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white rounded-2xl rounded-tl-sm border border-neutral-200 px-4 py-3">
              <Loader2 className="animate-spin text-primary-500" size={20} />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-neutral-200 px-4 py-3 safe-area-bottom">
        <div className="flex items-end gap-2">
          <button
            onClick={handleVoiceInput}
            disabled={isLoading || isListening}
            className={`p-3 rounded-xl ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-secondary-100 text-secondary-600'
            } active:scale-95 transition-transform disabled:opacity-50`}
            aria-label={isListening ? 'Listening...' : 'Start voice input'}
          >
            <Mic size={24} />
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none max-h-32"
            rows={1}
            aria-label="Message input"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-primary-500 text-white rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
