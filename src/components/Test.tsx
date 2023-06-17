import { useState } from "react";

import Select from "react-select";

const suggestions = ["American Idol", "The Voice", "The X Factor"];

export function SearchInput() {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Filter the suggestions based on the search value
    const filtered = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowDropdown(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowDropdown(false);
  };

  return (
    <div>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={suggestions[0]}
        isSearchable={true}
        name="Member"
        options={suggestions}
      />
    </div>
  );
}
