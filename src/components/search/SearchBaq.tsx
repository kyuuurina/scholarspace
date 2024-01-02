import React, { useState } from 'react';
import { useRouter } from 'next/router';

const SearchBaq: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    // Redirect to the search page with the query parameter
    void router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2">
        Search
      </button>
    </div>
  );
};

export default SearchBaq;
