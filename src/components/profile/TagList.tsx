import React from 'react';

// Predefined colors to iterate
const colors = ['bg-blue-500', 'bg-pink-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

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
