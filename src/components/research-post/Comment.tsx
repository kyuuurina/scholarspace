//Comment section on the research post card

import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

interface CommentProps {
  onAddComment: (comment: string) => void;
}

const Comment: React.FC<CommentProps> = ({ onAddComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(event.target.value);
  };

  const handleSendComment = () => {
    if (commentText.trim() !== "") {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <div>
      <ul>
        {/* Display existing comments here */}
      </ul>
      <div className="flex mt-2">
        <input
          type="text"
          value={commentText}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
          className="border rounded-l-md py-1 px-2 w-full"
        />
        <button
          onClick={handleSendComment}
          className="rounded-lg bg-purple-accent-1 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-accent-2 focus:outline-none"
        >
          <FiSend size={16} className="inline-block mr-2" />
          Send
        </button>
      </div>
    </div>
  );
};

export default Comment;
