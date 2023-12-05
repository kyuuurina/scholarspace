import React, { useState } from "react";
import CommentsSection from "./Comments";
import Avatar from "../avatar/avatar";
import { api } from "~/utils/api";

type TaskDrawerProps = {
  task: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    created_at: Date;
    assignees: string | null;
  };
  onClose: () => void;
};

const TaskDrawer: React.FC<TaskDrawerProps> = ({ task, onClose }) => {
  const [comments, setComments] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);

  // get user
  // get user from api
  const { data: user } = api.user.get.useQuery(
    { id: task.assignees || "" },
    { enabled: !!task.assignees }
  );

  const getStatusBadgeClassName = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-gray-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-yellow-100 text-gray-800";
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComments([...comments, e.target.value]);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachments([...attachments, e.target.value]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add logic to handle form submission (e.g., updating data)
    // ...
    onClose(); // Close the drawer after submission
  };

  return (
    <div
      id="drawer-update-task"
      className="w-300 fixed right-0 top-0 z-50 flex h-screen overflow-y-auto border-l border-gray-300 bg-white p-10"
      aria-labelledby="drawer-label"
      aria-hidden="true"
    >
      <div className="space-y-4">
        {/* Form fields for Task */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 grid space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Task Name
              </label>
              <input
                type="text"
                value={task.name}
                readOnly
                className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Description
              </label>
              <textarea
                value={task.description || ""}
                readOnly
                className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            {/* Attachments Section */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Attachments
              </label>
              <div className="flex flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-100 pb-6 pt-5">
                <svg
                  className="mb-4 h-8 w-8 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, JPEG, DOCX, or PDF
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <CommentsSection task_id={task.id} />
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Status
              </label>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClassName(
                  task.status
                )}`}
              >
                {task.status}
              </span>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Start Date
              </label>
              <input
                type="text"
                value={task.created_at.toLocaleDateString()}
                readOnly
                className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Assignees
              </label>
              {user && (
                <Avatar
                  id={user.id}
                  name={user.name}
                  avatar_url={user.avatar_url}
                  email={user.email}
                />
              )}
            </div>
            <div className="mt-4 flex w-full justify-center space-x-4 pb-4 sm:mt-0 sm:px-4">
              <button
                type="button"
                className="inline-flex w-20 items-center justify-center rounded-lg border border-purple-600 px-5 py-2.5 text-center text-sm font-medium text-purple-600 hover:bg-purple-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex w-20 items-center justify-center rounded-lg border border-purple-600 px-5 py-2.5 text-center text-sm font-medium text-purple-600 hover:bg-purple-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDrawer;
