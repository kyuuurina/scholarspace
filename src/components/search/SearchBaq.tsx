import React, { useState } from 'react';
import { useRouter } from 'next/router';

const SearchBaq: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const disabled = searchQuery.trim() === ''; // Disable the button if the search query is empty

  const handleSearch = () => {
    // Redirect to the search page with the query parameter
    void router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Search for an author or research scope..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 mr-2 rounded-l-lg focus:border-purple-200" // Rounded left corners for the input
        style={{ width: '900px' }} // Increased width for the input
      />
      <button
        onClick={handleSearch}
        className={`rounded-lg bg-purple-accent-1 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-accent-2 focus:outline-none ${disabled ? "opacity-50" : ""}`}
        disabled={disabled}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBaq;
