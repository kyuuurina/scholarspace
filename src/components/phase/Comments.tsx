import React, { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Comment from "./Comment";

type CommentsSectionProps = {
  task_id: string;
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ task_id }) => {
  const router = useRouter();
  const [newComment, setNewComment] = useState("");

  // Use the data property from commentsQuery to get the comments
  const commentsQuery = api.comment.list.useQuery(
    { task_id: task_id },
    { enabled: !!task_id }
  );
  const comments = commentsQuery.data || [];
  const addComment = api.comment.create.useMutation();

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create the comment
      await addComment.mutateAsync({
        task_id,
        value: newComment,
      });

      // Clear the input field
      setNewComment("");
      router.reload();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 lg:py-16">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white lg:text-2xl">
            Discussion ({comments.length})
          </h2>
        </div>
        <form onSubmit={handleCommentSubmit} className="mb-6">
          {/* Comment Input */}
          <div className="mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment"
              rows={6}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border-0 px-0 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              placeholder="Write a comment..."
              required
            ></textarea>
          </div>
          {/* Post Comment Button */}
          <button
            type="submit"
            className="bg-primary-700 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 inline-flex items-center rounded-lg bg-purple-500 px-4 py-2.5 text-center text-xs font-medium text-white focus:ring-4"
          >
            Post comment
          </button>
        </form>
        {/* Display Comments */}
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </section>
  );
};

export default CommentsSection;
