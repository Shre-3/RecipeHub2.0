import React, { useState } from 'react';
import { Search } from 'lucide-react';

export function SearchBar({ onSubmit }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-800 w-5 h-5" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a dish..."
        className="w-full pl-10 pr-24 py-2 rounded-lg bg-[#f4f1e7] border-2 border-[#1f5129] focus:outline-none focus:ring-2 focus:ring-emerald-600 text-emerald-900 placeholder-emerald-700/50"
      />
      <button 
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-[#1f5129] text-white rounded-md hover:bg-[#1f5129]/90 transition-colors"
      >
        Search
      </button>
    </form>
  );
}