import type { comment } from "@prisma/client";
import { api } from "~/utils/api";
import Avatar from "../avatar/avatar";

type CommentProps = {
  comment: comment;
};

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const { value, user_id, created_at } = comment;

  // get user from api
  const { data: user } = api.user.get.useQuery(
    { id: user_id },
    { enabled: !!user_id }
  );

  return (
    <article className="mb-1 border-t border-gray-200 bg-white p-4 text-base dark:border-gray-700 dark:bg-gray-900">
      <footer className="mb-1 flex items-center justify-between">
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
        {/* Add dropdown and other actions here */}
      </footer>
      <div
        dangerouslySetInnerHTML={{
          __html: value || "Add a detailed description here....",
        }}
      ></div>
      <div className="mt-4 flex items-center space-x-4">
        <button
          type="button"
          className="flex items-center text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
        >
          {/* Add reply functionality */}
          <svg
            className="mr-1.5 h-3.5 w-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
            />
          </svg>
          Reply
        </button>
      </div>
    </article>
  );
};

export default Comment;
