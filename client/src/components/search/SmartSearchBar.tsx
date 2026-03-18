import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Mic, ChevronDown, X } from 'lucide-react';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { Location } from '@/types';
import { motion, AnimatePresence, Variants } from 'framer-motion';

type SpeechRecognitionCtor = new () => SpeechRecognition;

type SpeechRecognitionResultEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

interface SmartSearchBarProps {
  onSearch: (query: string) => void;
  onSelect: (location: Location) => void;
  onVoiceSearch?: () => void;
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({ 
  onSearch, 
  onSelect,
  onVoiceSearch 
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { suggestions, isLoading } = useSearchSuggestions(query);
  
  // Animation variants
  const containerVariants: Variants = {
    collapsed: { width: 60 },
    expanded: { width: '100%' }
  };
  
  const inputVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.2 } }
  };
  
  const suggestionsVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } }
  };

  const handleFocus = useCallback(() => {
    if (query.length === 0) setIsExpanded(true);
  }, [query]);

  const handleBlur = useCallback(() => {
    if (query.length === 0) setIsExpanded(false);
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (query.length > 0) {
        setQuery('');
        onSearch('');
      } else if (isExpanded) {
        setIsExpanded(false);
      }
    }
  }, [isExpanded, query, onSearch]);

  const handleVoiceSearch = useCallback(async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }

    setIsVoiceListening(true);
    const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition) as unknown as SpeechRecognitionCtor;
    const recognition = new SpeechRecognition();
    
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: SpeechRecognitionResultEventLike) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      onSearch(transcript);
      handleSelectFromVoice(transcript);
      setIsVoiceListening(false);
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      console.error('Speech recognition error:', event.error);
      setIsVoiceListening(false);
    };
    
    recognition.onend = () => {
      setIsVoiceListening(false);
    };
    
    try {
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsVoiceListening(false);
    }
  }, [handleSelectFromVoice, onSearch]);

  const handleSelectFromVoice = useCallback((transcript: string) => {
    const match = suggestions.find(loc => 
      loc.name.toLowerCase().includes(transcript.toLowerCase())
    );
    if (match) {
      onSelect(match);
    }
  }, [suggestions, onSelect]);

  return (
    <motion.div
      variants={containerVariants}
      initial="collapsed"
      animate={isExpanded || query.length > 0 ? "expanded" : "collapsed"}
      className="relative w-full max-w-[400px] mx-auto"
    >
      <div className="flex items-center space-x-3">
        {/* Search Input Container */}
        <motion.div
          className="flex-1 relative"
          onClick={handleFocus}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Search buildings, food, events..."
            className={`
              w-full h-[56px] pl-10 pr-4 
              bg-transparent border-none 
              text-text-primary text-lg font-bold 
              placeholder:text-text-muted/60
              focus:outline-none focus:ring-0
              transition-all duration-300
            `}
          />
          
          {/* Search Icon */}
          <Search 
            className={`absolute left-4 top-1/2 -translate-y-1/2 
                       w-5 h-5 text-text-muted/60 
                       transition-colors duration-300
                       ${query.length > 0 ? 'text-text-primary' : ''}`}
          />
          
          {/* Clear Button */}
          {query.length > 0 && (
            <button
              onClick={() => {
                setQuery('');
                onSearch('');
                setIsExpanded(false);
                inputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 
                       p-1 rounded-full hover:bg-text-muted/10 
                       transition-all duration-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-text-muted/60 hover:text-text-primary" />
            </button>
          )}
          
          {/* Voice Search Button */}
          {!isExpanded && query.length === 0 && (
            <button
              onClick={handleVoiceSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 
                       p-1 rounded-full hover:bg-text-muted/10 
                       transition-all duration-200"
              aria-label="Voice search"
              disabled={isVoiceListening}
            >
              <Mic 
                className={`
                  w-5 h-5 
                  text-${isVoiceListening ? 'text-yellow-400 animate-pulse' : 'text-text-muted/60'}
                  transition-all duration-300
                `}
              />
            </button>
          )}
        </motion.div>
        
        {/* Expand/Collapse Button */}
        {!isExpanded && query.length === 0 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-10 h-10 flex items-center justify-center 
                     rounded-full bg-text-muted/5 hover:bg-text-muted/10 
                     transition-all duration-300"
          >
            <ChevronDown 
              className="w-4 h-4 text-text-muted/60 transition-transform duration-300"
            />
          </button>
        )}
      </div>
      
      {/* Suggestions Dropdown */}
      {isExpanded && (
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              variants={suggestionsVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={`
                absolute top-[56px] left-0 right-0 mt-2 
                rounded-xl bg-glass-panel border border-white/10 
                shadow-xl p-2 z-50 max-h-[400px] overflow-y-auto
                custom-scrollbar
              `}
            >
              {suggestions.map((location) => (
                <motion.div
                  key={location.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg 
                    hover:bg-white/5 transition-all duration-200 cursor-pointer
                  `}
                  onClick={() => {
                    setQuery(location.name);
                    onSelect(location);
                    setIsExpanded(false);
                  }}
                >
                  <div className="w-3 h-3 rounded-full" 
                       style={{ backgroundColor: getCategoryColor(location.category) }}></div>
                  <div className="flex flex-col">
                    <p className="text-text-primary font-medium">{location.name}</p>
                    <p className="text-text-sm text-text-muted/80 uppercase tracking-wider">
                      {location.category}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <div className="w-4 h-4 border-2 border-text-primary border-t-transparent rounded-full 
                           animate-spin"></div>
                </div>
              )}
              
              {(!isLoading && suggestions.length === 0) && (
                <div className="flex items-center justify-center py-4 text-text-muted/60 text-sm">
                  No results found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Food': return '#F97316';
    case 'Academic': return '#3B82F6';
    case 'Residence': return '#10B981';
    case 'Administration': return '#A855F7';
    case 'Entrance': return '#EF4444';
    case 'Health': return '#ef4444';
    default: return '#6B7280';
  }
};

export default SmartSearchBar;