import type { comment } from "@prisma/client";
import { api } from "~/utils/api";
import Avatar from "../../avatar/avatar";
import { FiMoreHorizontal } from "react-icons/fi";
import CommentActions from "./CommentActions";
import React, { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";

type CommentProps = {
  comment: comment;
};

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const { value, user_id, created_at } = comment;
  const [showActions, setShowActions] = useState(false);

  // get user from api
  const { data: user } = api.user.get.useQuery(
    { id: user_id },
    { enabled: !!user_id }
  );

  const ref = useClickAway(() => {
    setShowActions(false);
  });

  return (
    <div className="mb-1 border-t border-gray-200 bg-white p-4 text-base dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center">
          <p className="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
            {user && <Avatar avatar_url={user.avatar_url} email={user.email} />}
            <span className="ml-2">{user?.name}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time
              dateTime={created_at.toLocaleString()}
              title={created_at.toLocaleString()}
            >
              {new Date(created_at).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
        </div>
        <div className="relative">
          <div
            className="fa-icons cursor-pointer rounded-md p-2"
            onClick={() => setShowActions(true)}
          >
            <FiMoreHorizontal />
          </div>
          {showActions && (
            <div
              className="absolute left-0 top-full"
              ref={ref as React.MutableRefObject<HTMLDivElement>}
            >
              <CommentActions />
            </div>
          )}
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: value || "Add a comment here....",
        }}
      />
    </div>
  );
};

export default Comment;
