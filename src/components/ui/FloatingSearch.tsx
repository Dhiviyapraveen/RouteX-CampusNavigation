import React, { useEffect, useRef, useState } from "react";
import {
  Building2,
  DoorOpen,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  Home,
  MapPin,
  Search,
  Utensils,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Location } from "../../types";

interface FloatingSearchProps {
  locations: Location[];
  onSearch: (query: string) => void;
  onSelect: (location: Location) => void;
}

const getCategoryIcon = (category: string): React.ElementType => {
  switch (category) {
    case 'Academic': return GraduationCap;
    case 'Food': return Utensils;
    case 'Residence': return Home;
    case 'Administration': return Building2;
    case 'Entrance': return DoorOpen;
    case 'Recreation': return Dumbbell;
    case 'Health': return HeartPulse;
    default: return MapPin;
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Academic': return '#8b5cf6';
    case 'Food': return '#f97316';
    case 'Residence': return '#10b981';
    case 'Administration': return '#ec4899';
    case 'Entrance': return '#06b6d4';
    case 'Recreation': return '#eab308';
    case 'Health': return '#ef4444';
    default: return '#6366f1';
  }
};

const FloatingSearch: React.FC<FloatingSearchProps> = ({ locations, onSearch, onSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const suggestions = query
    ? locations.filter(loc => loc.name.toLowerCase().includes(query.toLowerCase())).slice(0, 7)
    : locations.slice(0, 7);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  const handleSelect = (loc: Location) => {
    setQuery(loc.name);
    setIsOpen(false);
    setIsFocused(false);
    onSelect(loc);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasDropdown = isOpen && suggestions.length > 0;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={cn(
          "glass-panel flex h-[52px] items-center gap-3 px-4 shadow-[0_10px_30px_rgba(2,6,23,0.35)]",
          "transition-[border-color,box-shadow,transform] duration-300",
          hasDropdown ? "rounded-t-2xl rounded-b-none" : "rounded-2xl",
          isFocused && "border-indigo-500/40 shadow-[0_0_0_4px_rgba(99,102,241,0.12),0_14px_44px_rgba(2,6,23,0.55)]",
        )}
      >
        <Search
          className={cn(
            "size-4 shrink-0 transition-colors duration-200",
            isFocused ? "text-indigo-300" : "text-muted-foreground/70",
          )}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => { setIsFocused(true); setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search campus locations..."
          className="w-full bg-transparent text-sm font-semibold tracking-tight text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
        {!query && (
          <span
            className="hidden shrink-0 rounded-md border border-border/70 bg-background/30 px-2 py-0.5 text-[10px] font-black tracking-widest text-muted-foreground sm:block"
          >
            ⌘K
          </span>
        )}
        {query && (
          <button
            onClick={handleClear}
            className="grid size-7 shrink-0 place-items-center rounded-full transition hover:bg-accent/70 active:scale-95"
            aria-label="Clear search"
          >
            <X className="size-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {hasDropdown && (
        <div
          className={cn(
            "absolute left-0 right-0 z-50 overflow-hidden rounded-b-2xl border border-indigo-500/25 border-t-0",
            "bg-background/85 backdrop-blur-2xl",
            "shadow-[0_24px_72px_rgba(2,6,23,0.55),0_0_0_1px_rgba(99,102,241,0.05)]",
          )}
        >
          {!query && (
            <div className="px-5 pt-3 pb-1">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                All locations
              </p>
            </div>
          )}
          {suggestions.map((loc, index) => {
            const IconComp = getCategoryIcon(loc.category);
            const color = getCategoryColor(loc.category);
            const isHighlighted = selectedIndex === index;
            return (
              <button
                key={loc.name}
                onClick={() => handleSelect(loc)}
                className={cn(
                  "relative flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  "focus:outline-none focus-visible:bg-accent/60",
                )}
                style={{
                  background: isHighlighted ? `${color}12` : undefined,
                  borderLeft: isHighlighted ? `3px solid ${color}` : "3px solid transparent",
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div
                  className="grid size-8 shrink-0 place-items-center rounded-xl"
                  style={{
                    background: `${color}16`,
                    border: `1px solid ${color}30`,
                    boxShadow: isHighlighted ? `0 0 14px ${color}30` : 'none',
                  }}
                >
                  <IconComp size={13} style={{ color }} />
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="max-w-full truncate text-sm font-semibold text-foreground">{loc.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: `${color}aa` }}>
                    {loc.category}
                  </span>
                </div>
                {isHighlighted && (
                  <div
                    className="ml-auto text-[9px] font-black tracking-widest"
                    style={{ color: `${color}80` }}
                  >
                    ENTER ↵
                  </div>
                )}
              </button>
            );
          })}
          <div className="h-2" />
        </div>
      )}
    </div>
  );
};

export default FloatingSearch;
