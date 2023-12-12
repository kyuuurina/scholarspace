// Post.tsx - final FE (w/out comment section yet)
import React, { useState } from 'react';
import Image from 'next/image';
import { FiHeart, FiMessageSquare } from 'react-icons/fi';
import Card from '../Card';
import Comment from './Comment'; // Import the Comment component

interface PostProps {
  post: {
    category: string;
    title: string;
    author: string | null;
    description: string | null;
  };
}

const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Article':
      return 'px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-sm';
    case 'Conference Paper':
      return 'px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-sm';
    case 'Presentation':
      return 'px-2 py-1 bg-pink-200 text-pink-800 rounded-full text-sm';
    case 'Preprint':
      return 'px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm';
    case 'Research Proposal':
      return 'px-2 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm';
    case 'Thesis':
      return 'px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm';
    default:
      return 'px-2 py-1 bg-white text-gray-800 rounded-full text-sm'; // Default styles for the category
  }
};

const Post: React.FC<PostProps> = ({ post }) => {
  const categoryStyles = getCategoryStyles(post.category);

  // Like
  const [liked, setLiked] = useState(false);
  const handleLikeClick = () => {
    setLiked((prevLiked) => !prevLiked);
  };

  // Comment
  const [comments, setComments] = useState<string[]>([]);

  const handleAddComment = (comment: string) => {
    setComments((prevComments) => [...prevComments, comment]);
  };

  return (
    <Card title={post.title}>
      <div className="flex items-center space-x-2 mb-2 md:mb-4">
        <span className={categoryStyles}>{post.category}</span>
      </div>

      <p className="mt-2 text-black text-sm md:text-base">
        {post.description || 'No description'}
      </p>

      <div className="mt-2 flex items-center mb-2 md:mb-4">
        <p className="mt-2 text-gray-500 text-xs md:text-sm">
          Author: {post.author || '-'}
        </p>
      </div>

      <div className="flex items-center mt-2 md:mt-4">
        <button className="mr-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none text-xs md:text-sm">
          <FiMessageSquare size={18} className="inline-block mr-1 md:mr-2" />
          Comment
        </button>
        <button
          onClick={handleLikeClick}
          className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none text-xs md:text-sm"
        >
          <FiHeart
            size={18}
            className={`inline-block mr-1 md:mr-2 ${liked ? 'text-red-500 fill-red-500' : ''}`}
          />
          Like
        </button>
      </div>

      {/* Add the Comment component here */}
      <Comment onAddComment={handleAddComment} />

      {/* Display existing comments */}
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </Card>
  );
};

export default Post;




        {/* Uncomment the following section if you want to include Reshare */}
        {/* <button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
          <FiRepeat size={20} className="inline-block mr-2" />
          Reshare
        </button> */}