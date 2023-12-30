import React from 'react';

// Predefined colors to iterate
const colors = ['bg-blue-200', 'bg-grey-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200'];

interface TagListProps {
  tags: string[];
}

const TagList: React.FC<TagListProps> = ({ tags }) => {
  let colorIndex = 0; // Counter to track color index

  return (
    <div>
      {tags.map((tag, index) => {
        // Use modulo to cycle through colors
        const colorClass: string | null | undefined = colors[colorIndex % colors.length];

        // Increment the color index for the next tag
        colorIndex++;

        // Use optional chaining and nullish coalescing to handle potential undefined values
        const tagContent = tag ?? ''; // or use tag || ''; if you don't want to handle empty string

        return (
          <span
            key={index}
            className={`px-2 py-1 ${colorClass ?? ''} text-white rounded-full text-sm mr-2`}
          >
            {tagContent}
          </span>
        );
      })}
    </div>
  );
};

export default TagList;
