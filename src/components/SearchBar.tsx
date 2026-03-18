import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        placeholder="Search building name..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-700 placeholder:text-gray-400"
      />
    </div>
  );
};

export default SearchBar;
