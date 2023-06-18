// // PostCard.tsx
// type PostCardProps = {
//     title: string;
//     uploadDocument: string;
//     description: string;
//     author: string;
//     onDelete: () => void;
//   };
  
//   const PostCard: React.FC<PostCardProps> = ({
//     title,
//     uploadDocument,
//     description,
//     author,
//     onDelete,
//   }) => {
//     const handleEdit = () => {
//       // Implement edit functionality, e.g., show NewPostForm with pre-filled data
//     };
  
//     const handleDelete = () => {
//       // Implement delete functionality, e.g., show confirmation message
//     };
  
//     return (
//       <div className="card">
//         <div className="card-content">
//           <h2>{title}</h2>
//           <p>{uploadDocument}</p>
//           <p>{description}</p>
//           <p>{author}</p>
//         </div>
//         <div className="card-actions">
//           <div className="kebab-icon">
//             <div className="dropdown-menu">
//               <button onClick={handleEdit}>Edit</button>
//               <button onClick={handleDelete}>Delete</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   export default PostCard;
  
import React from "react";

interface PostCardProps {
  title: string;
  author: string;
  description: string;
}

const PostCard: React.FC<PostCardProps> = ({ title, author, description }) => {
  return (
    <div className="post-card">
      <h3>{title}</h3>
      <p>Author: {author}</p>
      <p>{description}</p>
    </div>
  );
};

export default PostCard;
