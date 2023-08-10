/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

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

// components
import { Dropdown } from "../workspace/Dropdown";
import { WorkspaceModal } from "../workspace/WorkspaceModal";

export function SideBar() {
  const [open, setOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <WorkspaceModal
        openModal={modalIsOpen}
        onClick={() => setModalIsOpen(false)}
      />
      <div className="flex flex-row">
        <div
          className={`${
            open ? "w-56" : "w-16"
          } flex min-h-full flex-row overflow-y-auto bg-purple-950 px-2 py-6 shadow duration-300`}
        >
          <div className="min-w-full space-y-3 font-medium">
            <div className="ml-2 flex cursor-pointer items-center">
              <span onClick={handleToggle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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
            <div className="flex">
              <ul className="min-w-full space-y-1 pb-4 pt-2 text-sm">
                <li className="rounded-sm">
                  <Link
                    className={`flex items-center space-x-3 rounded-md p-2 hover:bg-purple-800 ${
                      open ? "text-gray-100" : "text-gray-100"
                    }`}
                    href="/"
                    onClick={handleToggle}
                  >
                    <FiHome className="h-6 w-6" />
                    <span className={`${open ? "text-gray-100" : "sr-only"}`}>
                      Home
                    </span>
                  </Link>
                </li>
                <li className=" rounded-sm">
                  <Link
                    href="/manage-profile"
                    className={`flex items-center space-x-3 rounded-md p-2 hover:bg-purple-800 ${
                      open ? "text-gray-100" : "text-gray-100"
                    }`}
                    onClick={handleToggle}
                  >
                    <FiActivity className="h-6 w-6" />
                    <span className={`${open ? "text-gray-100" : "sr-only"}`}>
                      My Profile
                    </span>
                  </Link>
                </li>
                <li className="rounded-sm">
                  <Link
                    href="/"
                    className={`flex items-center space-x-3 rounded-md p-2 hover:bg-purple-800 ${
                      open ? "text-gray-100" : "text-gray-100"
                    }`}
                    onClick={handleToggle}
                  >
                    <FiMessageCircle className="h-6 w-6" />
                    <span className={`${open ? "text-gray-100" : "sr-only"}`}>
                      Messages
                    </span>
                  </Link>
                </li>
                <li className="rounded-sm">
                  <Link
                    href="/home-rwp/cljdykk4m0008vu6kufa5klp9"
                    className={`flex items-center space-x-3 rounded-md p-2 hover:bg-purple-800 ${
                      open ? "text-gray-100" : "text-gray-100"
                    }`}
                  >
                    <FiBriefcase className="h-6 w-6" />
                    <span className={`${open ? "" : "sr-only"}`}>Projects</span>
                  </Link>
                </li>
                {open && (
                  <li className="p-2">
                    <hr className="max-w-1/2 m-2 my-6 border-white" />
                    <Dropdown onClick={() => setModalIsOpen(true)} />
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
