import React, { useState } from "react";
import { api } from "~/utils/api";

const SearchBar: React.FC<{ onSearch: (results: any[]) => void }> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    try {
      const searchResults = api.researchpost.search.useQuery({
        query: searchQuery,
      });
  
      // Ensure searchResults is an array before calling onSearch
      if (Array.isArray(searchResults)) {
        onSearch(searchResults);
      } else {
        console.error('Invalid search results:', searchResults);
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  return (
    <div>
      <input type="text" value={searchQuery} onChange={handleInputChange} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
