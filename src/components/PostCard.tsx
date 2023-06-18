import Link from "next/link";
import React, { useState } from "react";

interface PostCardProps {
  title: string;
  author: string;
  description: string;
  userProfilePicture: string;
  timestamp: string;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  author,
  description,
  userProfilePicture,
  timestamp,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEdit = () => {
    setShowDropdown(false);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    setShowDeleteConfirmation(true);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleConfirmDelete = () => {
    // Logic to delete the post
    console.log("Delete post:", title);
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="relative bg-white rounded-lg p-4 mb-4 shadow-md max-w-screen-md mx-auto">
      <div className="absolute top-0 right-0">
        <button
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
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
      <div className="flex items-center mb-4">
        <img
          className="w-8 h-8 rounded-full mr-2"
          src={userProfilePicture}
          alt="User Profile"
        />
        <p className="text-gray-500">Author: {author}</p>
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-500">Created on: {timestamp}</p>
      <p className="mt-2">{description}</p>
      <div className="flex items-center mt-4">
        <button className="mr-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Comment
        </button>
        <button className="mr-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 11l7-7 7 7M5 19l7-7 7 7"
            />
          </svg>
          Like
        </button>
        <button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 11l7-7 7 7M5 19l7-7 7 7"
            />
          </svg>
          Reshare
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold">Comments</h3>
        {/* Render comments here */}
      </div>
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-bold mb-2">Edit Post</h3>
            {/* Edit form fields go here */}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-bold mb-2">Delete Confirmation</h3>
            <p>Are you sure you want to delete this post?</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
