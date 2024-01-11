import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";

// local components
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import SignoutButton from "../auth/SignoutButton";

type NavbarProps = {
  toggleSidebar: () => void;
};

const NavBar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const user = useUser();
  const avatarUrl = user?.user_metadata?.avatar_url as string;

  // constants for overlay
  const overlayRef = useRef<HTMLDivElement>(null);
  const notifOverlayRef = useRef<HTMLDivElement>(null);
  const [isUserOverlayVisible, setIsUserOverlayVisible] = useState(false);
  const [isNotifOverlayVisible, setIsNotifOverlayVisible] = useState(false);

  // logic for user overlay
  const toggleUserOverlay = () => {
    setIsUserOverlayVisible(!isUserOverlayVisible);
  };

  const handleClickOutsideUser = (event: MouseEvent) => {
    if (
      overlayRef.current &&
      !overlayRef.current.contains(event.target as Node)
    ) {
      setIsUserOverlayVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideUser);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUser);
    };
  }, []);

  // logic for notification overlay
  const toggleNotifOverlay = () => {
    setIsNotifOverlayVisible(!isNotifOverlayVisible);
  };

  const handleClickOutsideNotif = (event: MouseEvent) => {
    if (
      notifOverlayRef.current &&
      !notifOverlayRef.current.contains(event.target as Node)
    ) {
      setIsNotifOverlayVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideNotif);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideNotif);
    };
  }, []);

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-2 flex flex-wrap items-center justify-between p-3">
        <div className="flex gap-x-1">
          <span className="cursor-pointer sm:hidden" onClick={toggleSidebar}>
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
          <Link href="/" className="flex items-center">
            <Image
              src="/scholarspace-logo-x1.png"
              width={100}
              height={100}
              alt="Scholarspace logo"
            />
          </Link>
        </div>

        <div className="flex items-center gap-x-4 text-white">
          {/* Notifications */}
          <div className="mt-2">
            <button
              className="inline-flex items-center text-center text-sm font-medium text-gray-600 hover:text-purple-accent-2 focus:outline-none"
              onClick={toggleNotifOverlay}
              type="button"
            >
              <svg
                className="h-6 w-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 14 20"
              >
                <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
              </svg>
              <div className="relative flex">
                <div className="relative -top-2 right-3 inline-flex h-3 w-3 rounded-full border-2 border-white bg-red-500 dark:border-gray-900"></div>
              </div>
            </button>
            {/* Display notifications */}
            {isNotifOverlayVisible && (
              <div
                ref={notifOverlayRef}
                className="absolute right-20 w-full max-w-sm divide-y divide-gray-100 rounded-lg bg-white shadow"
              >
                <div className="block rounded-t-lg bg-gray-50 px-4 py-2 text-center font-medium text-gray-700">
                  <div>Notifications</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {/* map notifications here */}
                  <Link
                    href="/"
                    className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex-shrink-0"></div>
                    <div className="w-full pl-3">
                      <div className="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
                        New message from{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Jese Leos
                        </span>
                        <p>: Hey, all set for the presentation?</p>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-500">
                        a few moments ago
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
          {/* User Menu  */}
          <div>
            <div className="cursor-pointer" onClick={toggleUserOverlay}>
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  width={32}
                  height={32}
                  alt="User avatar"
                />
              ) : (
                <div className="h-9 w-9">
                  <AvatarPlaceholder name="Khairina Atiqah" />
                </div>
              )}
            </div>
            {/* Display user information */}
            {isUserOverlayVisible && (
              <div
                ref={overlayRef}
                className="min-w-44 absolute right-5 z-10 divide-y divide-gray-100 rounded-lg bg-white shadow"
              >
                <div className="px-4 py-3 text-sm text-gray-900">
                  <div>{user?.user_metadata?.full_name}</div>
                  <div className="truncat font-medium">
                    {user?.user_metadata?.email}
                  </div>
                </div>
                <ul className="py-2 text-sm text-gray-700">
                  <li className="px-5 py-3 hover:bg-gray-100">
                    <p>Manage Account</p>
                  </li>
                  <li
                    className="px-5 py-3 hover:bg-gray-100"
                    onClick={() => setIsUserOverlayVisible(false)}
                  >
                    <Link href="/settings">Settings</Link>
                  </li>
                </ul>
                <SignoutButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
