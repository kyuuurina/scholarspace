import React from 'react';

interface CategoryPillsProps {
  category: string;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ category }) => {
  const colors = {
    Article: 'px-2 py-1 bg-red-200 text-red-800 rounded-full text-sm',
    Conference_Paper: 'px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-sm',
    Presentation: 'px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm',
    Preprint: 'px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm',
    Research_Proposal: 'px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-sm',
    Thesis: 'px-2 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm',
    Idea: 'px-2 py-1 bg-pink-200 text-pink-800 rounded-full text-sm',
    Others: 'px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-sm',
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
        {category}
    </div>
  );
};

export default CategoryPills;


// //import category enum values from prisma schema
// import { category } from "@prisma/client";

// interface CategoryPillsProps {
//   category: category;
// }

// const CategoryPills: React.FC<CategoryPillsProps> = ({ category }) => {
//   const colors = {
//     Article: 'bg-red-500',
//     Conference_Paper: 'bg-blue-500',
//     Presentation: 'bg-green-500',
//     Preprint: 'bg-yellow-500',
//     Research_Proposal: 'bg-purple-500',
//     Thesis: 'bg-pink-500',
//     Others: 'bg-gray-500',
//   };

//   return (
//     <span className={`px-2 py-1 rounded-full text-sm font-semibold ${colors[category as keyof typeof colors]}`}>
//       {category}
//     </span>
//   );
// };

// export default CategoryPills;
