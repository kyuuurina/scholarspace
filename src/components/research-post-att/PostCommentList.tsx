import React, { useState } from 'react';
import { fetchComments } from '~/utils/postcomment';
import AvatarPlaceholder from '../avatar/AvatarPlaceholder';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import SuccessToast from '../toast/SuccessToast';
import ErrorToast from '../toast/ErrorToast';
import toast from 'react-hot-toast';
import { api } from '~/utils/api';
import ConfirmationDialog from '../ConfirmationDialog';
import { useQuery, useQueryClient} from '@tanstack/react-query';


//auth
import { getCookie } from 'cookies-next';
import { UseCheckProfile } from '~/utils/profile';

interface UserProfile {
  name: string;
  avatar_url: string | null;
  user_id: string;
  profile_id: string;
}

interface Comment {
  comment_id: string;
  value: string;
  user: {
    profile: UserProfile[];
  };
  created_at: Date | null;
}

interface PostCommentListProps {
  post_id: string;
}

const PostCommentList: React.FC<PostCommentListProps> = ({ post_id }) => {
  const queryClient = useQueryClient();

  const { comments, isLoading, error } = fetchComments(post_id);
  const [showCommentList, setShowCommentList] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

    // Get user id and check profile
    const userId = getCookie('UserID') as string;
    const { user } = UseCheckProfile(userId);
  
    // Check if the user is the owner of a specific comment
    const isCommentOwner = (commentUserId: string) => {
      return user && user.id === commentUserId;
    };

  // Delete comment mutation
  const deleteCommentMutation = api.postcomment.delete.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Comment successfully deleted" />);
      // Comment row is deleted from UI immediately; no need to reset the comment id
    },
    onError: (deleteError) => {
      console.error('Failed to delete comment:', deleteError);
      toast.custom(() => <ErrorToast message="Failed to delete comment" />);
    },
    onSettled: () => {
      // Refetch the comments after deletion
      queryClient
        .invalidateQueries(['comments', post_id])
        .then(() => {
          setDeleteCommentId(null);
        })
        .catch((error) => {
          console.error('Error during comment refetch:', error);
          // Handle the error as needed
        });
    },
  });

  // Function to handle comment deletion
  const handleDeleteComment = (commentId: string) => {
    // Set the comment id to be deleted
    setDeleteCommentId(commentId);
  };

  // Confirm and delete comment
  const confirmAndDeleteComment = async () => {
    if (deleteCommentId !== null) {
      try {
        // Perform the comment deletion using the mutation
        await deleteCommentMutation.mutateAsync({ comment_id: deleteCommentId });
      } catch (error) {
        console.error('Error deleting comment:', error);
      } finally {
        // Reset the deleteCommentId after deletion
        setDeleteCommentId(null);
      }
    }
  };

  // Render logic based on comments, isLoading, and error
  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    // Convert the error message to a string
    const errorMessage = error.message ? error.message.toString() : 'An error occurred';
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div>
      <div
        className="cursor-pointer text-purple-800 hover:text-purple-900 focus:outline-none text-xs md:text-sm"
        onClick={() => setShowCommentList((prev) => !prev)}
      >
        {showCommentList ? 'Hide' : 'Show'} Comment Section
      </div>

      {showCommentList && (
        <div>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={comment.comment_id} className={`mb-4 ${index !== comments.length - 1 ? 'border-b border-gray-300' : ''}`}>
                {/* Render comment details */}
                {comment.user.profile.map((profile) => (
                  <div key={profile.user_id} className="flex items-center justify-between mt-4 mb-4">
                    <div className="mr-4">
                      {profile.avatar_url ? (
                        // Use next/image for images
                        <Link href={`/manage-profile/${profile.profile_id}`}>
                          <span className="relative inline-block cursor-pointer">
                            <Image
                              src={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/avatar/${profile.avatar_url}`}
                              alt={`Profile Avatar - ${profile.name}`}
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <span className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 opacity-50 rounded-full" />
                          </span>
                        </Link>
                      ) : (
                        <AvatarPlaceholder name={profile.name} shape="circle" />
                      )}
                    </div>
                    <div className="flex flex-col flex-grow">
                      <Link href={`/manage-profile/${profile.profile_id}`}>
                        <span className="font-semibold cursor-pointer max-w-full sm:max-w-[150px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                          {profile.name}
                        </span>
                      </Link>
                      <p className="mt-1">{comment.value}</p>
                    </div>
                    {user && isCommentOwner(profile.user_id) && (
                      <div className="flex items-center space-x-2">
                        {/* Edit icon */}
                        <FiEdit2 size={18} className="cursor-pointer text-gray-500 hover:text-gray-700" />
                        {/* Delete icon with onClick handler */}
                        <FiTrash2
                          size={18}
                          className="cursor-pointer text-gray-500 hover:text-gray-700"
                          onClick={() => handleDeleteComment(comment.comment_id)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No comments</p>
          )}
        </div>
      )}

      {/* Confirmation dialog for delete */}
      <ConfirmationDialog
        isOpen={deleteCommentId !== null}
        onClose={() => setDeleteCommentId(null)}
        onConfirm={confirmAndDeleteComment}
      />
    </div>
  );
};

export default PostCommentList;



// interface CommentListProps {
//   comments: Comment[]; // Pass the array of comments as a prop
// }

// const CommentList: React.FC<CommentListProps> = ({ comments }) => {
//   return (
//     <div>
//       <h3>Comments</h3>
//       <ul>
//         {comments.map((comment) => (
//           <li key={comment.comment_id}>
//             <div>
//               <strong>{comment.user.profile.name}</strong>
//             </div>
//             <p>{comment.value}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CommentList;

// import React from 'react';
// import { fetchComments } from '~/utils/postcomment';

// interface CommentListProps {
//   post_id: string;
//   value: string;
// }

// const CommentList: React.FC<CommentListProps> = ({ post_id }) => {
//   const { comments, isLoading, error } = fetchComments(post_id);

//   if (isLoading) {
//     return <p>Loading comments...</p>;
//   }

//   if (error) {
//     return <p>Error loading comments: {error.message}</p>;
//   }

//   return (
//     <div>
//       <h3>Comments</h3>
//       {comments.length === 0 ? (
//         <p>No comments yet.</p>
//       ) : (
//         <ul>
//           {comments.map((comment) => (
//             <li key={comment.comment_id}>{comment.value}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default CommentList;

