import { useState } from "react";
import Link from "next/link";
import { fetchUserWorkspaces } from "~/utils/userWorkspaces";
import { FiPlusCircle } from "react-icons/fi";
import Image from "next/image";
import AvatarPlaceholder from "../AvatarPlaceholder";
import { MoonLoader } from "react-spinners";

const WorkspaceDropdown: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [workspaceMenu, setWorkspaceMenu] = useState(false);

  const { workspaceListings, isLoading } = fetchUserWorkspaces();

  const handleToggleWorkspace = () => {
    setWorkspaceMenu(!workspaceMenu);
  };

  return (
    <div>
      <button
        className="inline-flex w-44 items-center rounded-md bg-purple-accent-1 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-purple-accent-2"
        type="button"
        onClick={handleToggleWorkspace}
      >
        <span className="mr-2">Switch Workspace</span>
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
        } w-44 divide-y divide-gray-100 rounded-md bg-white shadow`}
      >
        <ul className="h-48 overflow-y-auto py-2 text-gray-700">
          {isLoading ? (
            <MoonLoader
              color={"#ffff"}
              loading={true}
              aria-label="FadeLoader"
              data-testid="loader"
              size={20}
            />
          ) : (
            workspaceListings.map((workspace) => (
              <li
                key={workspace.id}
                className="flex w-full px-5 hover:bg-gray-100"
              >
                {workspace.cover_img ? (
                  <Image
                    src={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/workspace-covers/${workspace.cover_img}`}
                    alt={workspace?.name || ""}
                    width={50}
                    height={50}
                  />
                ) : (
                  <AvatarPlaceholder name={workspace.name} />
                )}
                <Link
                  key={workspace.id}
                  className="block overflow-hidden text-clip px-4 py-2"
                  href={`/workspace/${workspace.id}`}
                >
                  {workspace.name}
                </Link>
              </li>
            ))
          )}
        </ul>

        <div className="flex w-full flex-row items-center space-x-2 rounded-b-md bg-gray-50 px-4 py-3 text-purple-accent-1 hover:bg-gray-100">
          <FiPlusCircle className="text-purple-accent-1" />
          <button onClick={onClick} className="block text-sm">
            Add Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
