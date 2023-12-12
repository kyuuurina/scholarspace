// //Comment section on a research post

// Comment.tsx
import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

interface CommentProps {
  onAddComment: (comment: string) => void;
}

const Comment: React.FC<CommentProps> = ({ onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(event.target.value);
  };

  const handleSendComment = () => {
    if (commentText.trim() !== '') {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <div>
      <ul>
        {/* Display existing comments here */}
      </ul>
      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          value={commentText}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
          className="flex-1 py-2 px-3 rounded-md border focus:outline-none"
        />
        <button
          onClick={handleSendComment}
          className="bg-purple-accent-1 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-accent-2 focus:outline-none"
        >
          <FiSend size={16} className="inline-block mr-2" />
          Send
        </button>
      </div>
    </div>
  );
};

export default Comment;


// import React, { useState } from "react";
// import { FiSend } from "react-icons/fi";

// interface CommentProps {
//   onAddComment: (comment: string) => void;
// }

// const Comment: React.FC<CommentProps> = ({ onAddComment }) => {
//   const [commentText, setCommentText] = useState("");

//   const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setCommentText(event.target.value);
//   };

//   const handleSendComment = () => {
//     if (commentText.trim() !== "") {
//       onAddComment(commentText);
//       setCommentText("");
//     }
//   };

//   return (
//     <div>
//       <ul>
//         {/* Display existing comments here */}
//       </ul>
//       <div className="mt-4 flex space-x-2">
//         <input
//           type="text"
//           value={commentText}
//           onChange={handleCommentChange}
//           placeholder="Add a comment..."
//           className="flex-1 py-2 px-3 rounded-md border focus:outline-none"
//         />
//         <button
//           onClick={handleSendComment}
//           className="bg-purple-accent-1 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-accent-2 focus:outline-none"
//         >
//           <FiSend size={16} className="inline-block mr-2" />
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Comment;
