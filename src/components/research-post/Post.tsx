/* eslint-disable @typescript-eslint/await-thenable */
// Post.tsx - final FE (w/out comment section yet)
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiMessageSquare, FiHeart } from 'react-icons/fi';
import Card from '../Card';
import AvatarPlaceholder from '../avatar/AvatarPlaceholder';
import ProfileAvatarPlaceholder from '../avatar/ProfileAvatar';
import Comment from './Comment'; // Import the Comment component
import PostComment from './PostComment';
import CommentsList from './CommentList';

import router, { useRouter } from 'next/router';

//local
import SuccessToast from '../toast/SuccessToast';
import ErrorToast from '../toast/ErrorToast';
import toast from 'react-hot-toast';

// Auth
import { getCookie } from "cookies-next";

// Utils
import { UseCheckProfile } from "~/utils/profile";


//data fetching
import { api } from '~/utils/api';
import { useFetchUsers } from '~/utils/user';

interface PostProps {
  post: {
    post_id: string;  //just added
    user_id: string;
    // profile_id: string;
    // avatar_url: string | null;
    category: string;
    title: string;
    document: string | null;
    author: string | null;
    description: string | null;
    created_at: Date;
    // likeCount: number;

  };
  onEditClick: () => void;

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

const Post: React.FC<PostProps> = ({ post, onEditClick }) => {


  //get user id and check profile
  const userId = getCookie("UserID") as string;
  const { user } = UseCheckProfile(userId);

  const isOwner = user && user.id === post.user_id;

  // Fetch user data
  const { users, isLoading, error } = useFetchUsers();
  const associatedUser = users.find((user) => user.userId === post.user_id);   //find user associated with post
  const userName = associatedUser?.userName || 'DefaultName';         // Get the user name from the associated user or use a default value

  //Delete post
  const deleteMyPost = api.researchpost.delete.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Post successfully deleted" />);
    },
  });

  const handleDeleteMyPost = (post_id: string) => {
      deleteMyPost
        .mutateAsync({
          post_id: post_id,
        })
        .then(() => {
          router.reload();
        })
        .catch((error) => {
          console.error("Failed to delete post:", error);

          toast.custom(() => <ErrorToast message="Failed to delete post" />);
        });
  };


  //Edit Post


  //Document Storage
  const fileUrl = post.document
  ? `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/post-files-upload/${post.document}`
  : null;

  //Like
  const categoryStyles = getCategoryStyles(post.category);
  const [liked, setLiked] = useState(false);
  const toggleLike = api.postlike.toggleLike.useMutation();

 const handleLikeClick = async () => {
   try {
     const likeCount =
     await toggleLike.mutate({ post_id: post.post_id });

     // Update local state
     setLiked((prevLiked) => !prevLiked);
   } catch (error) {
     console.error('Error toggling like:', error);
   }
 };


  // Comment
  const [comments, setComments] = useState<string[]>([]);

  const handleAddComment = (comment: string) => {
    setComments((prevComments) => [...prevComments, comment]);
  };

  return (
    <Card title={post.title}>
      <div className="flex flex-col md:flex-row items-center mb-2 md:mb-4 relative">
        <div className="aspect:square h-10 w-10">
          <AvatarPlaceholder name={userName} shape="circle" />
            {/* {post.avatar_url !== null ? (
              <ProfileAvatarPlaceholder name={userName} shape="circle" avatar_url={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/avatar/${post.avatar_url}`} />
            ) : (
              <ProfileAvatarPlaceholder name={userName} shape="circle" />
            )} */}
        </div>
        <div className="md:ml-2 md:mt-0 mt-2">
          {/* Move the category span below the AvatarPlaceholder */}
          <span className={categoryStyles}>{post.category}</span>
        </div>

        {isOwner && (
          <div className="absolute top-0 right-0 flex items-center mt-2 space-x-2">
            <button onClick={onEditClick} className="text-blue-500 hover:text-blue-700 focus:outline-none text-xs md:text-sm">
              <FiEdit2 size={18} className="inline-block" />
            </button>
            {/* Place the red outline trash icon on the right side, inline with category span */}
            <button onClick={() => handleDeleteMyPost(post.post_id)} className="text-red-500 hover:text-red-700 focus:outline-none text-xs md:text-sm">
              <FiTrash2 size={18} className="inline-block" />
            </button>
          </div>
        )}
      </div>
  
      <div className="mt-2 flex items-center mb-2 md:mb-4">
        <p className="mt-2 text-black text-sm md:text-base">
          {post.description || 'No description'}
        </p>
      </div>
  
      <div className="mt-2 flex items-center mb-2 md:mb-4">
        <p className="mt-2 text-gray-500 text-xs md:text-sm">
          Author: {post.author || '-'}
        </p>
      </div>
  
      <div className="mt-2 flex items-center mb-2 md:mb-4">
        <p className="mt-2 text-gray-500 text-xs md:text-sm">
          Created At: {post.created_at.toLocaleString()} {/* Convert Date to string */}
        </p>
      </div>
  
      <div className="mt-4">
        {/* Display PDF file in an iframe */}
        {post.document && (
          <div className="mt-4">
            {post.document.toLowerCase().endsWith('.pdf') ? (
              // If the document is a PDF, use the PDF viewer
              <iframe
                src={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/post-files-upload/${post.document}`}
                title="PDF Viewer"
                width="100%"
                height="200px"
                frameBorder="0"
                scrolling="auto"
              />
            ) : (
              // If the document is not a PDF, use Google Docs Viewer
              <iframe
                src={`https://docs.google.com/gview?url=https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/post-files-upload/${post.document}&embedded=true`}
                title="Document Viewer"
                width="100%"
                height="200px"
                frameBorder="0"
                scrolling="auto"
              />
            )}
          </div>
        )}
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
          {/* {post.likeCount} */}
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