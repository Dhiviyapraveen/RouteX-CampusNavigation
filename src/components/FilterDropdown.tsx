import React from 'react';
import { Filter } from 'lucide-react';
import { Category } from '../types';

interface FilterDropdownProps {
  selectedCategory: Category | 'All';
  onCategoryChange: (category: Category | 'All') => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ selectedCategory, onCategoryChange }) => {
  const categories: (Category | 'All')[] = ['All', 'Academic', 'Food', 'Residence', 'Administration', 'Entrance', 'Recreation', 'Health'];

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Filter className="w-4 h-4" />
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as Category | 'All')}
        className="h-12 pl-10 pr-10 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-700 appearance-none cursor-pointer font-medium"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default FilterDropdown;
