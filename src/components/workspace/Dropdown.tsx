import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchUserWorkspaces } from "~/utils/userWorkspaces";

type Props = {
  onClick: () => void;
};

export const Dropdown: React.FC<Props> = ({ onClick }) => {
  const [workspaceMenu, setWorkspaceMenu] = useState(false);

  const { workspaceListings } = fetchUserWorkspaces();

  const handleToggleWorkspace = () => {
    setWorkspaceMenu(!workspaceMenu);
  };

  return (
    <div>
      <button
        className="inline-flex w-44 items-center rounded-sm bg-purple-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-800"
        type="button"
        onClick={handleToggleWorkspace}
      >
        Switch Workspace{" "}
        <svg
          className="ml-2 h-4 w-4"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <div
        className={`z-10 ${
          workspaceMenu ? "" : "hidden"
        } w-44 divide-y divide-gray-100 rounded-sm bg-white shadow dark:divide-gray-600 dark:bg-gray-700`}
      >
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
          {workspaceListings.map((workspace) => (
            <Link
              key={workspace.id}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              href={`/workspace/${workspace.id}`}
            >
              {workspace.name}
            </Link>
          ))}
        </ul>
        <div className="w-full py-2">
          <button
            onClick={onClick}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Add Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
