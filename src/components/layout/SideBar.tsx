// React and Next hooks
import { useState } from "react";
import Link from "next/link";

// icons
import {
  FiHome,
  FiActivity,
  FiMessageCircle,
  FiBriefcase,
} from "react-icons/fi";
import { IconContext } from "react-icons";

// components
import { Dropdown } from "../workspace/Dropdown";
import { WorkspaceModal } from "../workspace/WorkspaceModal";

type SideBarProps = {
  toggleSidebar: () => void;
  open: boolean;
};

export const SideBar: React.FC<SideBarProps> = ({
  toggleSidebar,
  open
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <WorkspaceModal
        openModal={modalIsOpen}
        onClick={() => setModalIsOpen(false)}
      />
      <div
        className={`min-h-screen transition-transform ${
          open
            ? "sm:14 translate-x-0"
            : "-translate-x-full sm:w-56 sm:translate-x-0"
        } sm:duration-300" fixed left-0 top-0 z-40
           bg-dark-purple p-4 sm:static
         sm:flex sm:shadow
         `}
        tabIndex={-1}
      >
        <div className="flex min-w-full flex-col space-y-6 font-medium">
          <div className="flex cursor-pointer items-center">
            <span onClick={toggleSidebar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-accent-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </span>
          </div>
          <IconContext.Provider value={{ className: "text-purple-accent-2" }}>
            <ul className="min-w-full space-y-6 text-sm">
              <li className="rounded-sm">
                <Link
                  className={`flex items-center space-x-3 rounded-md hover:bg-purple-800 ${
                    open ? "text-purple-accent-2" : "text-purple-accent-2"
                  }`}
                  href="/"
                  onClick={toggleSidebar}
                >
                  <FiHome className="h-6 w-6" />
                  <span
                    className={`${open ? "text-purple-accent-2" : "sr-only"}`}
                  >
                    Home
                  </span>
                </Link>
              </li>
              <li className=" rounded-sm">
                <Link
                  href="/manage-profile"
                  className={`flex items-center space-x-3 rounded-md hover:bg-purple-800 ${
                    open ? "text-purple-accent-2" : "text-purple-accent-2"
                  }`}
                  onClick={toggleSidebar}
                >
                  <FiActivity className="h-6 w-6" />
                  <span
                    className={`${open ? "text-purple-accent-2" : "sr-only"}`}
                  >
                    My Profile
                  </span>
                </Link>
              </li>
              <li className="rounded-sm">
                <Link
                  href="/"
                  className={`flex items-center space-x-3 rounded-md hover:bg-purple-800 ${
                    open ? "text-purple-accent-2" : "text-purple-accent-2"
                  }`}
                  onClick={toggleSidebar}
                >
                  <FiMessageCircle className="h-6 w-6" />
                  <span
                    className={`${open ? "text-purple-accent-2" : "sr-only"}`}
                  >
                    Messages
                  </span>
                </Link>
              </li>
              <li className="rounded-sm">
                <Link
                  href="/home-rwp/cljdykk4m0008vu6kufa5klp9"
                  className={`flex items-center space-x-3 rounded-md hover:bg-purple-800 ${
                    open ? "text-purple-accent-2" : "text-purple-accent-2"
                  }`}
                >
                  <FiBriefcase className="h-6 w-6" />
                  <span className={`${open ? "" : "sr-only"}`}>Projects</span>
                </Link>
              </li>
              {open && (
                <li className="p-2">
                  <hr className="max-w-1/2 m-2 my-6 border-purple-accent-2" />
                  <Dropdown onClick={() => setModalIsOpen(true)} />
                </li>
              )}
            </ul>
          </IconContext.Provider>
        </div>
      </div>
    </>
  );
}

export default SideBar;
