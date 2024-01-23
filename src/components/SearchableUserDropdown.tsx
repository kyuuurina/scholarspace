import React, { useState, useEffect, useRef } from "react";
import Avatar from "./avatar/avatar";
import type { user } from "@prisma/client";

type SearchableDropdownProps = {
  options: user[];
  onSelect: (selectedOptions: user[]) => void;
};

// ... (imports and types)

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<user[]>(options);
  const [selectedOptions, setSelectedOptions] = useState<user[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (option) =>
          option.email &&
          option.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (option: user) => {
    const updatedSelectedOptions = [...selectedOptions];

    // Toggle selection
    const index = updatedSelectedOptions.findIndex(
      (selectedOption) => selectedOption.id === option.id
    );

    if (index === -1) {
      updatedSelectedOptions.push(option);
    } else {
      updatedSelectedOptions.splice(index, 1);
    }

    setSelectedOptions(updatedSelectedOptions);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    onSelect(selectedOptions);
  }, [selectedOptions, onSelect]);

  return (
    <div ref={dropdownRef} className="searchable-dropdown relative">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={handleToggleDropdown}
        onBlur={handleToggleDropdown}
        className="relative z-10 w-52"
      />
      <div className="absolute left-0 right-0 top-8 z-20 flex space-x-2">
        {selectedOptions.map((option) => (
          <div key={option.id} className="p-2">
            <Avatar avatar_url={option.id} email={option.email} />
          </div>
        ))}
      </div>
      {isOpen && (
        <div className="absolute z-20 w-52 truncate rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 hover:bg-gray-100">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 ${
                selectedOptions.some(
                  (selectedOption) => selectedOption.id === option.id
                )
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleSelectOption(option)}
            >
              <div className="flex space-x-2">
                <Avatar avatar_url={option.id} email={option.email} />
                {option.email}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
