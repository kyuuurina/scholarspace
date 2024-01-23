import { useState, useEffect } from "react";
import { TbSwitchVertical } from "react-icons/tb";
import { BASE_WORKSPACE_COVER_URL } from "~/utils/supabase-storage";
import { api } from "~/utils/api";
import { MoonLoader } from "react-spinners";
import Link from "next/link";
import { FiPlusCircle } from "react-icons/fi";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import Image from "next/image";
import { useClickAway } from "@uidotdev/usehooks";

const WorkspaceNavButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [workspaceMenu, setWorkspaceMenu] = useState(false);
  const ref = useClickAway(() => {
    setWorkspaceMenu(false);
  });

  const handleToggleWorkspace = () => {
    setWorkspaceMenu(!workspaceMenu);
  };

  const { data: workspaceListings, isLoading } =
    api.workspace.listUserWorkspaces.useQuery();

  // Retrieve the stored value from localStorage
  const storedWorkspaceString = localStorage.getItem("selectedWorkspace");
  const storedWorkspace = storedWorkspaceString
    ? (JSON.parse(storedWorkspaceString) as {
        name: string;
        cover_img: string | null;
        id: string;
      })
    : null;

  // Initialize selectedWorkspace with the stored value or null if not found
  const [selectedWorkspace, setSelectedWorkspace] = useState<{
    name: string;
    cover_img: string | null;
    id: string;
  } | null>(storedWorkspace);

  useEffect(() => {
    // Save the selected workspace to localStorage whenever it changes
    if (selectedWorkspace) {
      localStorage.setItem(
        "selectedWorkspace",
        JSON.stringify(selectedWorkspace)
      );
    }
  }, [selectedWorkspace]);

  if (!workspaceListings) {
    return null;
  }

  console.log(localStorage.getItem("selectedWorkspace"));

  return (
    <div className="relative">
      <button
        className="inline-flex w-44 items-center rounded-md  px-4 py-2.5 text-center text-xs font-medium hover:bg-gray-200"
        type="button"
        onClick={handleToggleWorkspace}
      >
        <div className="flex w-full items-center justify-between space-x-1 text-white">
          {selectedWorkspace?.cover_img ? (
            <Image
              src={`${BASE_WORKSPACE_COVER_URL}/${selectedWorkspace?.cover_img}`}
              alt={selectedWorkspace?.name || ""}
              width={40}
              height={40}
              loading="lazy"
            />
          ) : (
            <div className="h-5 w-7">
              <AvatarPlaceholder
                name={selectedWorkspace?.name || ""}
                shape="square"
              />
            </div>
          )}
          <span className="line-clamp-1 text-gray-600">
            {selectedWorkspace?.name || "Select a Workspace"}
          </span>
          <TbSwitchVertical className="h-4 w-4 text-gray-600" />
        </div>
      </button>

      <div
        className={`absolute left-0 top-full z-10 ${
          workspaceMenu ? "" : "hidden"
        } w-44 divide-y divide-gray-100 rounded-md bg-white shadow`}
      >
        <ul
          className="h-48 overflow-y-auto py-2 text-gray-700"
          ref={ref as React.MutableRefObject<HTMLUListElement>}
        >
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
                  onClick={() => {
                    setSelectedWorkspace({
                      name: workspace.workspace.name,
                      cover_img: workspace.workspace.cover_img,
                      id: workspace.workspaceid,
                    });
                    setWorkspaceMenu(false);
                  }}
                >
                  <div className="truncate">{workspace.workspace.name}</div>
                </Link>
              </li>
            ))
          )}
        </ul>

        <div className="flex w-full flex-row items-center space-x-2 rounded-b-md bg-gray-50 px-4 py-3 text-purple-accent-1 hover:bg-gray-100">
          <FiPlusCircle className="text-purple-accent-1" />
          <button
            onClick={() => {
              onClick();
              setWorkspaceMenu(false);
            }}
            className="block text-sm"
          >
            Add Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceNavButton;
