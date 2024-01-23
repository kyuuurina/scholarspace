import Link from "next/link";
import { FiPlusCircle } from "react-icons/fi";
import Image from "next/image";
import { MoonLoader } from "react-spinners";
import { api } from "~/utils/api";
import { BASE_WORKSPACE_COVER_URL } from "~/utils/supabase-storage";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";

const WorkspaceDropdownList: React.FC<{
  workspaceMenu: boolean;
  onClick: () => void;
}> = ({ workspaceMenu, onClick }) => {
  const { data: workspaceListings, isLoading } =
    api.workspace.listUserWorkspaces.useQuery();

  if (!workspaceListings) {
    return null;
  }

  return (
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
  );
};

export default WorkspaceDropdownList;
