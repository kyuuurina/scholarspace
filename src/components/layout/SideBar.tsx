// React and Next hooks
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useUser } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";
import { useFetchProfile } from "~/utils/profile";
import { useEffect } from "react";

// icons
import { FiHome, FiUser, FiSettings, FiColumns } from "react-icons/fi";
import { IconContext } from "react-icons";

// components
import WorkspaceDropdown from "../workspace/WorkspaceDropdown";
import WorkspaceModal from "../workspace/WorkspaceModal";
import { profile } from "console";

type SideBarProps = {
  toggleSidebar: () => void;
  open: boolean;
  // profileId?: string;
};

export const SideBar: React.FC<SideBarProps> = ({
  toggleSidebar,
  open,
  // profileId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // auth objects
  const user = useUser(); // user object from supabase
  const router = useRouter();
  // const session = useSession();
  useSessionContext();
  const { supabaseClient } = useSessionContext();

  // id constants
  // const { user } = session.data?.user; // user object from supabase session

  // Fetch user profile based on the router query
  const { profile_id, isLoading, error } = useFetchProfile();

  // Check for errors during profile fetch
  useEffect(() => {
    if (error) {
      console.error("Error fetching profile:", error);
    }
  }, [error]);

  // Check if router.query and router.query.id are defined before accessing their values
  const id = router.query && router.query.id ? router.query.id.toString() : "";

  console.log("Sidebar id", id);
  // console.log("SideBar profileId:", profileId);
  console.log("sidebar router", router.asPath);
  console.log("userId", user?.id);
  console.log("Profile_ID", profile_id);

  // get profile by user id
  const profileData = api.profile.getProfileByUserId.useQuery({
    user_id: user?.id || "",
  });

  let profileID = null;
  if (profileData.isLoading) {
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
  } else {
    profileID = profileData.data?.profile_id;
  }

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
                {/* <Link
                  className={`flex items-center space-x-3 rounded-md hover:bg-purple-800 ${
                    open ? "text-purple-accent-2" : "text-purple-accent-2"
                  }`}
                  href={user?.id ? `/home-rwp/${user.id}` : `/`}
                  onClick={toggleSidebar}
                >
                  <FiHome className="h-6 w-6" />
                  <span
                    className={`transition-all duration-500 ${
                      open
                        ? "text-purple-accent-2 opacity-100"
                        : "sr-only opacity-0"
                    }`}
                  >
                    Home
                  </span>
                </Link> */}
                <Link
                  className={`flex items-center space-x-3 rounded-md hover:bg-purple-800 ${
                    open ? "text-purple-accent-2" : "text-purple-accent-2"
                  }`}
                  href={`/`}
                  onClick={toggleSidebar}
                >
                  <FiHome className="h-6 w-6" />
                  <span
                    className={`transition-all duration-500 ${
                      open
                        ? "text-purple-accent-2 opacity-100"
                        : "sr-only opacity-0"
                    }`}
                  >
                    Home
                  </span>
                </Link>
              </li>

              <li className=" rounded-sm">
                {profileID && (
                  <Link
                    // href={profileId ? `/manage-profile/${profileId}` : ""}
                    href={`/manage-profile/${profileID}`}
                    className={`flex items-center space-x-3 rounded-md hover:bg-purple-800 ${
                      open ? "text-purple-accent-2" : "text-purple-accent-2"
                    }`}
                    onClick={toggleSidebar}
                  >
                    <FiUser className="h-6 w-6" />
                    <span
                      className={`transition-all duration-500 ${
                        open
                          ? "text-purple-accent-2 opacity-100"
                          : "sr-only opacity-0"
                      }`}
                    >
                      My Profile
                    </span>
                  </Link>
                )}
              </li>

              {/* <li className="rounded-sm">
                <Link
                  href="/chat"
                  className={`flex items-center space-x-3 rounded-md hover:bg-purple-800 ${
                    open ? "text-purple-accent-2" : "text-purple-accent-2"
                  }`}
                  onClick={toggleSidebar}
                >
                  <FiMessageCircle className="h-6 w-6" />
                  <span
                    className={`transition-all duration-500 ${
                      open
                        ? "text-purple-accent-2 opacity-100"
                        : "sr-only opacity-0"
                    }`}
                  >
                    Messages
                  </span>
                </Link>
              </li> */}
              <li className="rounded-sm">
                <Link
                  href="/manage-templates"
                  className={`flex items-center space-x-3 rounded-md hover:bg-purple-800 ${
                    open ? "text-purple-accent-2" : "text-purple-accent-2"
                  }`}
                >
                  <FiColumns className="h-6 w-6" />
                  <span
                    className={`transition-all duration-500 ${
                      open
                        ? "text-purple-accent-2 opacity-100"
                        : "sr-only opacity-0"
                    }`}
                  >
                    Manage Templates
                  </span>
                </Link>
              </li>
              <li className="rounded-sm">
                <Link
                  href="/settings"
                  className={`flex items-center space-x-3 rounded-md hover:bg-purple-800 ${
                    open ? "text-purple-accent-2" : "text-purple-accent-2"
                  }`}
                >
                  <FiSettings className="h-6 w-6" />
                  <span
                    className={`transition-all duration-500 ${
                      open
                        ? "text-purple-accent-2 opacity-100"
                        : "sr-only opacity-0"
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
            </ul>
          </IconContext.Provider>
        </div>
      </div>
    </>
  );
};

export default SideBar;
