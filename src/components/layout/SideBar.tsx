// React and Next hooks
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { api } from "~/utils/api";
import { useUser } from "@supabase/auth-helpers-react";

// icons
import {
  FiHome,
  FiUser,
  FiMenu,
  FiSettings,
  FiColumns,
  FiMessageCircle,
  FiBriefcase,
} from "react-icons/fi";

import WorkspaceDropdown from "../workspace/WorkspaceDropdown";
const WorkspaceModal = dynamic(() => import("../workspace/WorkspaceModal"), {
  loading: () => null,
});

type SideBarProps = {
  toggleSidebar: () => void;
  open: boolean;
  profileId: string | undefined;
};

export const SideBar: React.FC<SideBarProps> = ({
  toggleSidebar,
  open,
  profileId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const user = useUser();
  if (!profileId) {
    return (
      <div
        className={`min-h-screen transition-all duration-300 ${
          open
            ? "translate-x-0 sm:w-56"
            : "-translate-x-full sm:w-16 sm:translate-x-0"
        } fixed left-0 top-0 z-40 bg-dark-purple
      p-4 sm:static sm:flex`}
        tabIndex={-1}
      >
        {" "}
      </div>
    );
  }

  const { data: projects } = api.project.listProjectsByUserId.useQuery({
    user_id: user?.id ?? "",
  });

  return (
    <>
      <WorkspaceModal
        openModal={modalIsOpen}
        onClick={() => setModalIsOpen(false)}
      />
      <div
        className={`min-h-screen transition-all duration-300 ${
          open
            ? "translate-x-0 sm:w-56"
            : "-translate-x-full sm:w-16 sm:translate-x-0"
        } fixed left-0 top-0 z-40 bg-dark-purple
          p-4 sm:static sm:flex`}
        tabIndex={-1}
      >
        <div className="flex flex-col space-y-6 font-medium">
          <div className="flex cursor-pointer items-center">
            <FiMenu
              className="h-6 w-6 text-purple-accent-2"
              onClick={toggleSidebar}
            />
          </div>
          <ul className="min-w-full space-y-6 text-sm">
            <li className="rounded-sm">
              <Link
                className="flex items-center space-x-3 rounded-md text-purple-accent-2 hover:bg-purple-800"
                href={`/`}
                onClick={toggleSidebar}
              >
                <FiHome className="h-6 w-6" />
                <span
                  className={`transition-all duration-500 ${
                    open ? "opacity-100" : "sr-only opacity-0"
                  }`}
                >
                  Home
                </span>
              </Link>
            </li>

            <li className=" rounded-sm">
              <Link
                // href={profileId ? `/manage-profile/${profileId}` : ""}
                href={`/manage-profile/${profileId}`}
                className="flex items-center space-x-3 rounded-md text-purple-accent-2 hover:bg-purple-800"
                onClick={toggleSidebar}
              >
                <FiUser className="h-6 w-6" />
                <span
                  className={`transition-all duration-500 ${
                    open ? "opacity-100" : "sr-only opacity-0"
                  }`}
                >
                  My Profile
                </span>
              </Link>
            </li>

            <li className=" rounded-sm">
              <Link
                href={`/chat`}
                className="flex items-center space-x-3 rounded-md text-purple-accent-2 hover:bg-purple-800"
                onClick={toggleSidebar}
              >
                <FiMessageCircle className="h-6 w-6" />
                <span
                  className={`transition-all duration-500 ${
                    open ? "opacity-100" : "sr-only opacity-0"
                  }`}
                >
                  Chats
                </span>
              </Link>
            </li>
            <li className="rounded-sm">
              <Link
                href="/manage-templates"
                className="flex items-center space-x-3 rounded-md text-purple-accent-2 hover:bg-purple-800"
              >
                <FiColumns className="h-6 w-6" />
                <span
                  className={`transition-all duration-500 ${
                    open ? "opacity-100" : "sr-only opacity-0"
                  }`}
                >
                  Manage Templates
                </span>
              </Link>
            </li>
            <li className="rounded-sm">
              <Link
                href="/settings"
                className="flex items-center space-x-3 rounded-md text-purple-accent-2 hover:bg-purple-800"
              >
                <FiSettings className="h-6 w-6" />
                <span
                  className={`transition-all duration-500 ${
                    open ? "opacity-100" : "sr-only opacity-0"
                  }`}
                >
                  Settings
                </span>
              </Link>
            </li>
            {open && (
              <li
                className={`max-w-1/2 m-2 my-6 border-purple-accent-2 transition-all duration-500 ${
                  open ? "opacity-100" : "opacity-0"
                }`}
              >
                <WorkspaceDropdown onClick={() => setModalIsOpen(true)} />
              </li>
            )}
            <li>
              <div className="flex items-center space-x-3 text-purple-accent-2">
                <FiBriefcase className="h-6 w-6" />
                <span
                  className={`transition-all duration-500 ${
                    open ? "opacity-100" : "sr-only opacity-0"
                  }`}
                >
                  Projects
                </span>
              </div>
              <ul
                className={`h-48 min-w-full space-y-3 overflow-y-auto py-2 pl-8 text-sm ${
                  open ? "opacity-100" : "sr-only opacity-0"
                }`}
              >
                {/* iterate through projects to go to project/[id] */}
                {projects?.map((project) => (
                  <li key={project.project_id}>
                    <Link
                      href={`/project/${project.project_id}`}
                      className="flex items-center space-x-3 rounded-md text-white hover:bg-purple-800"
                      onClick={toggleSidebar}
                    >
                      <span
                        className={`line-clamp-1 transition-all duration-500 ${
                          open ? "opacity-100" : "sr-only opacity-0"
                        }`}
                      >
                        {/* add square here */}
                        🔵 {" " + project.project.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;
