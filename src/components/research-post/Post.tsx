/* eslint-disable @typescript-eslint/await-thenable */
// Post.tsx - final FE (w/out comment section yet)
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { MoonLoader } from 'react-spinners';
import { FiEdit2, FiTrash2, FiMessageSquare, FiHeart } from 'react-icons/fi';
import Card from '../Card';
import AvatarPlaceholder from '../avatar/AvatarPlaceholder';
import ProfileAvatarPlaceholder from '../avatar/ProfileAvatar';
// import CommentsList from './CommentList'; // Import the CommentList component
import { useForm } from 'react-hook-form';
import CommentList from '../research-post-att/PostCommentList';
import PostComment, { FormValues as CommentFormValues } from '../research-post-att/PostComment';
import PostCommentList from '../research-post-att/PostCommentList';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { useQuery } from '@tanstack/react-query';

import router, { useRouter } from 'next/router';

// Local imports
import SuccessToast from '../toast/SuccessToast';
import ErrorToast from '../toast/ErrorToast';
import toast from 'react-hot-toast';

// Auth
import { getCookie } from 'cookies-next';

// Utils
import { UseCheckProfile } from '~/utils/profile';

// Data fetching
import { api } from '~/utils/api';
import { useFetchUsers } from '~/utils/user';

// Define the Comment interface
interface Comment {
  comment_id: string;
  value: string;
  user: {
    profile: {
      name: string;
      avatar_url: string | null;
    };
  };
}

// Define the Profile interface
interface Profile {
  name: string;
  avatar_url: string | null;
  profile_id: string;
}

// Define the PostProps interface
interface PostProps {
  post: {
    post_id: string;
    user_id: string;
    category: string;
    title: string;
    document: string | null;
    author: string | null;
    description: string | null;
    created_at: Date;
    comments?: Comment[];
    profile?: Profile | null;

  };
  onEditClick: () => void;
  refetch: () => void;
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
    case 'Idea':
      return 'px-2 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm';
    default:
      return 'px-2 py-1 bg-white text-gray-800 rounded-full text-sm'; // Default styles for the category
  }
};

const Post: React.FC<PostProps> = ({ post, onEditClick, refetch }) => {
  // Get user id and check profile
  const userId = getCookie('UserID') as string;
  const { user } = UseCheckProfile(userId);

  const isOwner = user && user.id === post.user_id;

  // Fetch user data
  const { users, isLoading, error } = useFetchUsers();
  const associatedUser = users.find((user) => user.userId === post.user_id);
  const userName = associatedUser?.userName || 'DefaultName';



  // Delete post
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
        console.error('Failed to delete post:', error);
        toast.custom(() => <ErrorToast message="Failed to delete post" />);
      });
  };

  // Document Storage
  const fileUrl = post.document
    ? `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/post-files-upload/${post.document}`
    : null;

    const [documentLoading, setDocumentLoading] = useState(true);


  // Like
  const categoryStyles = getCategoryStyles(post.category);
  const [liked, setLiked] = useState(false);
  const toggleLike = api.postlike.toggleLike.useMutation();

  const handleLikeClick = async () => {
    try {
      const likeCount = await toggleLike.mutate({ post_id: post.post_id });
      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const schema: ZodType<CommentFormValues> = z.object({
    value: z.string().min(3, { message: 'Comment is too short' }),
  });

  // React-hook-form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(schema),
  });

  // Fetch task comments
  const commentsQuery = api.postcomment.list.useQuery(
    { post_id: post.post_id },
    { enabled: !!post.post_id }
  );

    const comments = commentsQuery.data || [];

  // Create a new comment
  const addComment = api.postcomment.create.useMutation();

  const handleCommentSubmit = async (formData: CommentFormValues) => {
    try {
      // Create the comment
      await addComment.mutateAsync({
        post_id: post.post_id,
        value: formData.value,
      });
      reset();
      refetch();
      await commentsQuery.refetch();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // State for toggling comment list visibility
  const [showCommentList, setShowCommentList] = useState(false);

  // Function to toggle comment list visibility
  const toggleCommentList = () => {
    setShowCommentList((prev) => !prev);
  };



  return (
    <Card title={post.title}>
      <div className="flex flex-col md:flex-row items-center mb-2 md:mb- relative">
        <div className="mt-2 flex items-center mb-10 md:mb-4">
          <span className={categoryStyles}>{post.category}</span>
        </div>

        <div className="mt-2 flex items-center mb-2 md:mb-4">
          <div className="aspect:square h-10 w-10 md:mr-2">
          {post.profile?.avatar_url ? (
            <Link href={`/manage-profile/${post.profile.profile_id}`}>
              <span className="relative inline-block cursor-pointer">
                <div className="h-10 w-10">
                  <Image
                    src={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/avatar/${post.profile.avatar_url}`}
                    alt={post.profile.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <span className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 opacity-50 rounded-full" />
              </span>
            </Link>
          ) : (
            <ProfileAvatarPlaceholder name={post.profile?.name || 'DefaultName'} shape="circle" />
          )}
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="mt-2 flex items-center mb-2 md:mb-4">
              {/* Use next/link for the profile name */}
              <Link href={`/manage-profile/${post.profile?.profile_id || ''}`}>
                <span className="mt-2 text-black text-sm md:text-base font-semibold cursor-pointer">
                  {post.profile?.name || ''}
                </span>
              </Link>
            </div>

          {isOwner && (
            <div className="absolute top-0 right-0 flex items-center mt-2 space-x-2">
              <button
                onClick={onEditClick}
                className="text-blue-500 hover:text-blue-700 focus:outline-none text-xs md:text-sm"
              >
                <FiEdit2 size={18} className="inline-block" />
              </button>
              <button
                onClick={() => handleDeleteMyPost(post.post_id)}
                className="text-red-500 hover:text-red-700 focus:outline-none text-xs md:text-sm"
              >
                <FiTrash2 size={18} className="inline-block" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>


      <div className="mt-2 flex items-center mb-2 md:mb-4">
        <p className="mt-2 text-black text-sm md:text-base">{post.description || 'No description'}</p>
      </div>
  
      <div className="mt-2 flex items-center mb-2 md:mb-4">
        <p className="mt-2 text-gray-500 text-xs md:text-sm">Author: {post.author || ''}</p>
      </div>
  
      <div className="mt-2 flex items-center mb-2 md:mb-4">
        <p className="mt-2 text-gray-500 text-xs md:text-sm">
          Created At: {post.created_at.toLocaleString()}
        </p>
      </div>
  
      <div className="mt-4">
        {post.document && (
          <div className="mt-4 relative">
            {documentLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <MoonLoader color="#4F46E5" size={50} />
              </div>
            )}

            {post.document.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/post-files-upload/${post.document}`}
                title="PDF Viewer"
                width="100%"
                height="200px"
                frameBorder="0"
                scrolling="auto"
                onLoad={() => setDocumentLoading(false)} // Set loading state to false when the document is loaded
              />
            ) : (
              <iframe
                src={`https://docs.google.com/gview?url=https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/post-files-upload/${post.document}&embedded=true`}
                title="Document Viewer"
                width="100%"
                height="200px"
                frameBorder="0"
                scrolling="auto"
                onLoad={() => setDocumentLoading(false)} // Set loading state to false when the document is loaded
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
        </button>
      </div>
  
      <div className="mt-4">
        {/* Display comment creation form */}
        <PostComment 
              post_id={post.post_id} 
              onCommentSubmit={handleCommentSubmit}
              refetch={async () => { await commentsQuery.refetch();}}
            />
      </div>
  
      <div className="mt-4">
      <PostCommentList
        post_id={post.post_id}
        refetch={async () => { await commentsQuery.refetch();}}
      />
      </div>
    </Card>
  );
};

export default Post;
