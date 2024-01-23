import { useState, useEffect } from "react";
import { TbSwitchVertical } from "react-icons/tb";
import { BASE_PROJECT_COVER_URL } from "~/utils/supabase-storage";
import { api } from "~/utils/api";
import { MoonLoader } from "react-spinners";
import Link from "next/link";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import Image from "next/image";
import { useClickAway } from "@uidotdev/usehooks";

const ProjectNavButton: React.FC = () => {
  const [workspaceMenu, setWorkspaceMenu] = useState(false);
  const ref = useClickAway(() => {
    setWorkspaceMenu(false);
  });

  const handleToggleWorkspace = () => {
    setWorkspaceMenu(!workspaceMenu);
  };

  const storedWorkspaceString = localStorage.getItem("selectedWorkspace");
  const storedWorkspace = storedWorkspaceString
    ? (JSON.parse(storedWorkspaceString) as {
        name: string;
        cover_img: string | null;
        id: string;
      })
    : null;

  const { data: projectListings, isLoading } =
    api.project.listWorkspaceProjects.useQuery({
      workspace_id: storedWorkspace?.id || "",
    });

  // Retrieve the stored value from localStorage
  const storedProjectString = localStorage.getItem("selectedProject");
  const storedProject = storedProjectString
    ? (JSON.parse(storedProjectString) as {
        name: string;
        cover_img: string | null;
        id: string;
      })
    : null;

  // Initialize selectedWorkspace with the stored value or null if not found
  const [selectedProject, setSelectedProject] = useState<{
    name: string;
    cover_img: string | null;
    id: string;
  } | null>(storedProject);

  useEffect(() => {
    // Save the selected workspace to localStorage whenever it changes
    if (selectedProject) {
      localStorage.setItem("selectedProject", JSON.stringify(selectedProject));
    }
  }, [selectedProject]);

  if (!projectListings) {
    return null;
  }

  return (
    <div className="relative">
      <button
        className="inline-flex w-44 items-center rounded-md  px-4 py-2.5 text-center text-xs font-medium hover:bg-gray-200"
        type="button"
        onClick={handleToggleWorkspace}
      >
        <div className="flex w-full items-center justify-between space-x-1 text-white">
          {selectedProject?.cover_img ? (
            <Image
              src={`${BASE_PROJECT_COVER_URL}/${selectedProject?.cover_img}`}
              alt={selectedProject?.name || ""}
              width={40}
              height={40}
              loading="lazy"
            />
          ) : (
            <div className="h-5 w-7">
              <AvatarPlaceholder
                name={selectedProject?.name || ""}
                shape="square"
              />
            </div>
          )}
          <span className="line-clamp-1 text-gray-600">
            {selectedProject?.name || "Select a Workspace"}
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
            projectListings.map((project) => (
              <li
                key={project.project_id}
                className="flex w-full items-center px-4 hover:bg-gray-100"
              >
                {project.cover_img ? (
                  <Image
                    src={`${BASE_PROJECT_COVER_URL}/${project.cover_img}`}
                    alt={project.name || ""}
                    width={40}
                    height={40}
                    loading="lazy"
                  />
                ) : (
                  <div className="h-7 w-10">
                    <AvatarPlaceholder name={project.name} shape="square" />
                  </div>
                )}
                <Link
                  key={project.project_id}
                  className="block overflow-hidden text-clip px-4 py-2"
                  href={`/project/${project.project_id}`}
                  onClick={() => {
                    setSelectedProject({
                      name: project.name,
                      cover_img: project.cover_img,
                      id: project.project_id,
                    });
                    setWorkspaceMenu(false);
                  }}
                >
                  <div className="truncate">{project.name}</div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProjectNavButton;
