import { useState } from "react";
import Link from "next/link";
import { FiPlusCircle } from "react-icons/fi";
import Image from "next/image";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import { MoonLoader } from "react-spinners";
import { TbSwitchHorizontal } from "react-icons/tb";
import { api } from "~/utils/api";
import { BASE_WORKSPACE_COVER_URL } from "~/utils/supabase-storage";

const WorkspaceDropdown: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [workspaceMenu, setWorkspaceMenu] = useState(false);
  const { data: workspaceListings, isLoading } =
    api.workspace.listUserWorkspaces.useQuery();

  if (!workspaceListings) {
    return null;
  }

  const handleToggleWorkspace = () => {
    setWorkspaceMenu(!workspaceMenu);
  };

  return (
    <div>
      <button
        className="inline-flex w-44 items-center rounded-md bg-purple-accent-1 px-4 py-2.5 text-center text-xs font-medium hover:bg-purple-accent-2"
        type="button"
        onClick={handleToggleWorkspace}
      >
        <div className="flex w-full items-center justify-between space-x-2 text-white">
          <span>Switch Workspace</span>
          <TbSwitchHorizontal className="h-4 w-4" />
        </div>
      </button>

      <div
        className={`z-10 ${
          workspaceMenu ? "" : "hidden"
        } w-44 divide-y divide-gray-100 rounded-md bg-white shadow`}
      >
        <ul className="h-48 overflow-y-auto py-2 text-gray-700">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <MoonLoader
                color={"#6233D5"}
                loading={true}
                aria-label="FadeLoader"
                data-testid="loader"
                size={20}
              />
            </div>
          ) : (
            workspaceListings.map((workspace) => (
              <li
                key={workspace.workspaceid}
                className="flex w-full items-center px-4 hover:bg-gray-100"
              >
                {workspace.workspace.cover_img ? (
                  <Image
                    src={`${BASE_WORKSPACE_COVER_URL}${workspace.workspace.cover_img}`}
                    alt={workspace.workspace.name || ""}
                    width={40}
                    height={40}
                    loading="lazy"
                  />
                ) : (
                  <div className="h-7 w-10">
                    <AvatarPlaceholder
                      name={workspace.workspace.name}
                      shape="square"
                    />
                  </div>
                )}
                <Link
                  key={workspace.workspaceid}
                  className="block overflow-hidden text-clip px-4 py-2"
                  href={`/workspace/${workspace.workspaceid}`}
                >
                  <div className="truncate">{workspace.workspace.name}</div>
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
