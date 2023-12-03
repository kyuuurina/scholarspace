// please do not use authorID as it will confuses me with the actual author column in the research_post table. cant we just use user_id instead of authorID?

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import CategoryPills from "./CategoryPills";
import {
  FiHeart,
  FiMessageSquare,
  FiRepeat,
  FiMoreHorizontal,
  FiEdit,
  FiTrash,
} from "react-icons/fi";
import Comment from "~/components/research-post/Comment";

import AvatarPlaceholder from "~/components/avatar/AvatarPlaceholder";

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
    <div className="relative mx-auto mb-4 max-w-screen-md rounded-lg bg-white p-4 shadow-md">
      <div className="absolute right-0 top-0">
        <button
          className="rounded-full p-2 hover:bg-gray-200 focus:outline-none"
          onClick={handleToggleDropdown}
        >
          <FiMoreHorizontal size={24} />
        </button>
        {showDropdown && (
          <div className="absolute right-0 z-10 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleEdit}
            >
              <FiEdit size={16} className="mr-2 inline-block" />
              Edit
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              onClick={handleDelete}
            >
              <FiTrash size={16} className="mr-2 inline-block" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* content in the post card */}
      <div className="mb-4 flex items-center space-x-2">
        <span className="rounded-full bg-blue-200 px-2 py-1 text-sm text-blue-800">
          {category}
        </span>
      </div>
      <div className="mt-2-flex mt-4 items-center">
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <div className="mt-2-flex mb-4 items-center">
        <p className="text-sm">Created on: {created_at}</p>
      </div>

      <p className="mt-2 text-black">{description}</p>

      <div className="mt-2-flex mb-4 items-center">
        <p className="mt-2 text-gray-500">Author: {author}</p>
      </div>

      {/* div of comment, likes and reshare */}
      <div className="mt-4 flex items-center">
        <button className="mr-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
          <FiMessageSquare size={20} className="mr-2 inline-block" />
          Comment
        </button>
        <button className="mr-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
          <FiHeart size={20} className="mr-2 inline-block" />
          Like
        </button>
        <button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
          <FiRepeat size={20} className="mr-2 inline-block" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="rounded-md bg-white p-4 shadow-md">
            <h3 className="mb-2 text-lg font-bold">Edit Post</h3>
            {/* Edit form fields go here */}
            <div className="flex justify-end">
              <button
                className="hover-bg-gray-300 mr-2 rounded-md bg-gray-200 px-4 py-2 text-gray-700"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="rounded-md bg-white p-4 shadow-md">
            <h3 className="mb-2 text-lg font-bold">Delete Confirmation</h3>
            <p>Are you sure you want to delete this post?</p>
            <div className="flex justify-end">
              <button
                className="hover-bg-gray-300 mr-2 rounded-md bg-gray-200 px-4 py-2 text-gray-700"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="hover-bg-red-600 rounded-md bg-red-500 px-4 py-2 text-white"
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
