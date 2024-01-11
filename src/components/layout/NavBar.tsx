import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";

// local components
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import SignoutButton from "../auth/SignoutButton";

type NavbarProps = {
  toggleSidebar: () => void;
};

const NavBar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const user = useUser();

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

  // get profile by user id
  const profileData = api.profile.getProfileByUserId.useQuery({
    user_id: user?.id || "",
  });

  let avatarUrl = null;
  if (profileData.data?.avatar_url) {
    avatarUrl = `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/avatar/${profileData.data?.avatar_url}`;
  }

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
                  <div>{profileData.data?.name}</div>
                  <div className="truncat font-medium">
                    {user?.user_metadata?.email || user?.email}
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
