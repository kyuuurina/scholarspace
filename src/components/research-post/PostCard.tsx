// please do not use authorID as it will confuses me with the actual author column in the research_post table. cant we just use user_id instead of authorID?

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import CategoryPills from "./CategoryPills";
import { FiHeart, FiMessageSquare, FiRepeat, FiMoreHorizontal, FiEdit, FiTrash } from "react-icons/fi";
import Comment from "~/components/research-post/Comment";

import AvatarPlaceholder from "../AvatarPlaceholder";

interface PostCardProps {

  title: string;
  category: string;
  author: string;
  description: string;
  created_at: string;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  category,
  author,
  description,
  created_at,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [comments, setComments] = useState<string[]>([]);

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

  const addComment = (comment: string) => {
    setComments([...comments, comment]);
  };

  return (
    <div className="relative bg-white rounded-lg p-4 mb-4 shadow-md max-w-screen-md mx-auto">
      <div className="absolute top-0 right-0">
        <button
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
          onClick={handleToggleDropdown}
        >
          <FiMoreHorizontal size={24} />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={handleEdit}
            >
              <FiEdit size={16} className="inline-block mr-2" />
              Edit
            </button>
            <button
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              onClick={handleDelete}
            >
              <FiTrash size={16} className="inline-block mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* content in the post card */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
          {category}
        </span>
      </div>
      <div className = "mt-2-flex items-center mt-4">
        <h3 className="text-lg font-bold">{title}</h3>
      </div>     
      <div className= "mt-2-flex items-center mb-4">
        <p className="text-sm">Created on: {created_at}</p>
      </div>

      <p className="mt-2 text-black">{description}</p>

      <div className="mt-2-flex items-center mb-4">
        <p className="mt-2 text-gray-500">Author: {author}</p>
      </div>

      {/* div of comment, likes and reshare */}
      <div className="flex items-center mt-4">
        <button className="mr-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
          <FiMessageSquare size={20} className="inline-block mr-2" />
          Comment
        </button>
        <button className="mr-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
          <FiHeart size={20} className="inline-block mr-2" />
          Like
        </button>
        <button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
          <FiRepeat size={20} className="inline-block mr-2" />
          Reshare
        </button>
      </div>
      
      <div className="mt-4">
        <Comment onAddComment={addComment} />
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-bold mb-2">Edit Post</h3>
            {/* Edit form fields go here */}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover-bg-gray-300"
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
                className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover-bg-gray-300"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover-bg-red-600"
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
