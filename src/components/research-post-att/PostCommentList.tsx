import React from 'react';
import { fetchComments } from '~/utils/postcomment';

interface CommentListProps {
  post_id: string;
  value: string;
}

const CommentList: React.FC<CommentListProps> = ({ post_id }) => {
  const { comments, isLoading, error } = fetchComments(post_id);

  if (isLoading) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p>Error loading comments: {error.message}</p>;
  }

  return (
    <div>
      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.comment_id}>{comment.value}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentList;

