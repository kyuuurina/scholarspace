import React, { useState } from "react";
import EditPostModal from "./EditPostModal";

interface PostCardProps {
  title: string;
  author: string;
  description: string;
}

const PostCard: React.FC<PostCardProps> = ({ title, author, description }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEdit = () => {
    setShowEditModal(true);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Delete this post?");
    if (confirmDelete) {
      // Logic to delete the post
      console.log("Delete post:", title);
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative bg-white rounded-lg p-4 mb-4">
      <div className="absolute top-0 right-0">
        <button
          className="p-2 rounded-full hover:bg-gray-200"
          onClick={handleToggleDropdown}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-500">Author: {author}</p>
      <p className="mt-2">{description}</p>
      {showEditModal && (
        <EditPostModal
          title={title}
          author={author}
          description={description}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default PostCard;
