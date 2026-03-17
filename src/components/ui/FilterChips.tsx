import React from "react";
import {
  Building2,
  DoorOpen,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  Home,
  LayoutGrid,
  Utensils,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Category } from "../../types";

interface FilterChipsProps {
  selectedCategory: Category | 'All';
  onCategoryChange: (category: Category | 'All') => void;
}

const CATEGORIES: { label: Category | 'All'; icon: React.ElementType; color: string }[] = [
  { label: 'All', icon: LayoutGrid, color: '#6366f1' },
  { label: 'Academic', icon: GraduationCap, color: '#8b5cf6' },
  { label: 'Food', icon: Utensils, color: '#f97316' },
  { label: 'Residence', icon: Home, color: '#10b981' },
  { label: 'Administration', icon: Building2, color: '#ec4899' },
  { label: 'Entrance', icon: DoorOpen, color: '#06b6d4' },
  { label: 'Recreation', icon: Dumbbell, color: '#eab308' },
  { label: 'Health', icon: HeartPulse, color: '#ef4444' },
];

const FilterChips: React.FC<FilterChipsProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      {CATEGORIES.map(({ label, icon: Icon, color }) => {
        const isActive = selectedCategory === label;
        return (
          <button
            key={label}
            onClick={() => onCategoryChange(label)}
            className={cn(
              "relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-bold",
              "transition-[transform,background-color,border-color,box-shadow,color] duration-300",
              "hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
            )}
            style={{
              background: isActive ? `linear-gradient(135deg, ${color}24, ${color}14)` : "hsl(var(--background) / 0.30)",
              borderColor: isActive ? `${color}55` : "hsl(var(--border) / 0.65)",
              color: isActive ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
              boxShadow: isActive ? `0 0 0 3px ${color}20, 0 0 18px ${color}26` : "none",
              transform: isActive ? "scale(1.04)" : undefined,
            }}
          >
            <Icon
              size={12}
              style={{ color: isActive ? color : 'rgba(148, 163, 184, 0.55)' }}
            />
            {label}
            {isActive && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at center, ${color}15 0%, transparent 70%)`,
                  borderRadius: 999,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;
