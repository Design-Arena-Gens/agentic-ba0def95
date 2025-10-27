'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Download, MessageSquare, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '@/app/providers';
import ChatInterface from './ChatInterface';

export default function HistoryPage() {
  const { conversations, deleteConversation, triggerHaptic, setCurrentConversation } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [viewingConversation, setViewingConversation] = useState(false);

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    triggerHaptic('medium');
    deleteConversation(id);
    setShowDeleteConfirm(null);
  };

  const handleExport = (conversation: any) => {
    triggerHaptic('medium');
    const content = `${conversation.title}\nCategory: ${conversation.category}\nDate: ${format(
      conversation.timestamp,
      'PPpp'
    )}\n\n${conversation.messages
      .map(
        (msg: any) =>
          `${msg.role.toUpperCase()} (${format(msg.timestamp, 'pp')}):\n${msg.content}\n`
      )
      .join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${conversation.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleViewConversation = (conversation: any) => {
    triggerHaptic('medium');
    setCurrentConversation(conversation);
    setViewingConversation(true);
  };

  if (viewingConversation) {
    return <ChatInterface onBack={() => setViewingConversation(false)} />;
  }

  return (
    <div className="min-h-full px-4 py-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">History</h1>
        <p className="text-neutral-600">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400"
            size={20}
          />
          <input
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
            aria-label="Search conversations"
          />
        </div>
      </motion.div>

      {/* Conversations List */}
      <div className="space-y-4">
        {filteredConversations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageSquare className="mx-auto mb-4 text-neutral-300" size={48} />
            <p className="text-neutral-500">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
          </motion.div>
        )}

        {filteredConversations.map((conversation, index) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card overflow-hidden"
          >
            <button
              onClick={() => handleViewConversation(conversation)}
              className="w-full p-4 text-left"
              aria-label={`View conversation: ${conversation.title}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-neutral-900 flex-1 pr-2">
                  {conversation.title}
                </h3>
                <span className="text-xs text-white bg-primary-500 px-2 py-1 rounded-full">
                  {conversation.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Calendar size={14} />
                <time dateTime={conversation.timestamp.toISOString()}>
                  {format(conversation.timestamp, 'PPp')}
                </time>
              </div>
              <p className="text-sm text-neutral-600 mt-2">
                {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
              </p>
            </button>

            {/* Actions */}
            <div className="border-t border-neutral-200 px-4 py-3 flex gap-2">
              <button
                onClick={() => handleExport(conversation)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary-50 text-secondary-600 rounded-xl font-medium active:scale-95 transition-transform"
                aria-label="Export conversation"
              >
                <Download size={18} />
                <span>Export</span>
              </button>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setShowDeleteConfirm(conversation.id);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium active:scale-95 transition-transform"
                aria-label="Delete conversation"
              >
                <Trash2 size={18} />
                <span>Delete</span>
              </button>
            </div>

            {/* Delete Confirmation */}
            <AnimatePresence>
              {showDeleteConfirm === conversation.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-neutral-200 bg-red-50 px-4 py-3"
                >
                  <p className="text-sm text-red-800 mb-3">
                    Are you sure you want to delete this conversation?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(conversation.id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium active:scale-95 transition-transform"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        setShowDeleteConfirm(null);
                      }}
                      className="flex-1 px-4 py-2 bg-white text-neutral-700 rounded-xl font-medium border border-neutral-300 active:scale-95 transition-transform"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
