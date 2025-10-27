'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Heart, Leaf, Stethoscope, Laptop, Grid as GridIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '@/app/providers';
import ChatInterface from './ChatInterface';

const categories = [
  {
    id: 'emotional',
    name: 'Emotional Support',
    icon: Heart,
    color: 'primary',
    description: 'Mental health, stress management, and emotional wellness',
    examples: ['Anxiety relief', 'Stress management', 'Mindfulness', 'Self-care tips'],
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: Leaf,
    color: 'secondary',
    description: 'Farming techniques, crop management, and sustainable agriculture',
    examples: ['Crop rotation', 'Pest control', 'Soil health', 'Organic farming'],
  },
  {
    id: 'health',
    name: 'Health & Medical',
    icon: Stethoscope,
    color: 'primary',
    description: 'General health, wellness, and medical information',
    examples: ['Nutrition', 'Exercise', 'Sleep health', 'Preventive care'],
  },
  {
    id: 'tech',
    name: 'Tech',
    icon: Laptop,
    color: 'secondary',
    description: 'Technology, programming, and digital tools',
    examples: ['Coding tips', 'Software tools', 'Web development', 'AI & ML'],
  },
  {
    id: 'all',
    name: 'All',
    icon: GridIcon,
    color: 'primary',
    description: 'General questions and multi-category topics',
    examples: ['General advice', 'Mixed topics', 'Quick questions', 'Exploration'],
  },
];

export default function CategoriesPage() {
  const { triggerHaptic, setCurrentConversation, addConversation } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatCategory, setChatCategory] = useState('All');

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayCategories = selectedCategory
    ? filteredCategories.filter((cat) => cat.id === selectedCategory)
    : filteredCategories;

  const handleCategorySelect = (categoryName: string) => {
    triggerHaptic('medium');
    setChatCategory(categoryName);
    const newConversation = {
      id: Date.now().toString(),
      category: categoryName,
      messages: [],
      timestamp: new Date(),
      title: `${categoryName} Conversation`,
    };
    setCurrentConversation(newConversation);
    addConversation(newConversation);
    setShowChat(true);
  };

  const toggleCard = (id: string) => {
    triggerHaptic('light');
    setExpandedCard(expandedCard === id ? null : id);
  };

  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} />;
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
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Categories</h1>
        <p className="text-neutral-600">Choose a category to get started</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4"
      >
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400"
            size={20}
          />
          <input
            type="search"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
            aria-label="Search categories"
          />
        </div>
      </motion.div>

      {/* Filter Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <button
          onClick={() => {
            triggerHaptic('light');
            setShowFilters(!showFilters);
          }}
          className="flex items-center gap-2 text-primary-500 font-medium"
          aria-label="Toggle filters"
          aria-expanded={showFilters}
        >
          <SlidersHorizontal size={20} />
          <span>Filters</span>
        </button>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedCategory(null);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Category Cards */}
      <div className="space-y-4">
        {displayCategories.map((category, index) => {
          const Icon = category.icon;
          const isExpanded = expandedCard === category.id;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => toggleCard(category.id)}
                className="w-full p-4 flex items-start gap-4 text-left"
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category.name} category`}
                aria-expanded={isExpanded}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-${category.color}-100 flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`text-${category.color}-500`} size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-neutral-600">{category.description}</p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="text-neutral-400 flex-shrink-0" size={20} />
                ) : (
                  <ChevronDown className="text-neutral-400 flex-shrink-0" size={20} />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-neutral-200 pt-4">
                      <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                        Example Topics:
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {category.examples.map((example, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleCategorySelect(category.name)}
                        className="btn-primary w-full"
                        aria-label={`Start conversation in ${category.name}`}
                      >
                        Start Conversation
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {displayCategories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-neutral-500"
        >
          No categories found matching &quot;{searchQuery}&quot;
        </motion.div>
      )}
    </div>
  );
}
