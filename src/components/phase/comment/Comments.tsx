import React from "react";
import Comment from "./Comment";
import type { comment } from "@prisma/client";

type CommentsProps = {
  rootComment: comment;
  replies: comment[];
  refetch: () => Promise<void>;
};

const Comments: React.FC<CommentsProps> = ({
  rootComment,
  refetch,
  replies,
}) => {
  return (
    <div>
      <div key={rootComment.id}>
        <Comment comment={rootComment} refetch={refetch} canReply={true} />
      </div>
      {replies.length > 0 && (
        <div style={{ marginLeft: "20px" }}>
          {/* Render replies using Comment component */}
          {replies.map((reply) => (
            <Comment key={reply.id} comment={reply} refetch={refetch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
