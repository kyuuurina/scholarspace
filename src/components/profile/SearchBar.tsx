// components/SearchBar.tsx
import React, { ChangeEvent, KeyboardEvent } from "react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
  return (
    <div className="relative mr-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-5 w-5 text-gray-500"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
      <input
        type="text"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900"
        placeholder="Search for a research post title or profile..."
        value={searchQuery}
        onChange={onSearchChange}
        onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter") {
            onSearchSubmit();
          }
        }}
      />
    </div>
  );
};

export default SearchBar;


// import React, { ChangeEvent } from "react";

// interface SearchBarProps {
//   searchQuery: string;
//   onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
// }

// const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
//   return (
//     <div className="relative mr-4">
//       <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//         <svg
//           className="h-5 w-5 text-gray-500"
//           aria-hidden="true"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fillRule="evenodd"
//             d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//             clipRule="evenodd"
//           ></path>
//         </svg>
//       </div>
//       <input
//         type="text"
//         className="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900"
//         placeholder="Search for a research post title or profile..."
//         value={searchQuery}
//         onChange={onSearchChange}
//       />
//     </div>
//   );
// };

// export default SearchBar;
