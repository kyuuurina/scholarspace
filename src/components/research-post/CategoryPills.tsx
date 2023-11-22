//import category enum values from prisma schema
import { category } from "@prisma/client";

interface CategoryPillsProps {
  category: category;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ category }) => {
  const colors = {
    Article: 'bg-red-500',
    Conference_Paper: 'bg-blue-500',
    Presentation: 'bg-green-500',
    Preprint: 'bg-yellow-500',
    Research_Proposal: 'bg-purple-500',
    Thesis: 'bg-pink-500',
    Others: 'bg-gray-500',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${colors[category as keyof typeof colors]}`}>
      {category}
    </span>
  );
};

export default CategoryPills;
