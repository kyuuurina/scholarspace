import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignoutButton } from "../auth/SignoutButton";
import { useUser } from "@supabase/auth-helpers-react";

export function NavBar() {
  const user = useUser();
  const [isUserOverlayVisible, setIsUserOverlayVisible] = useState(false);
  const avatarUrl = user?.user_metadata?.avatar_url as string;

  const toggleUserOverlay = () => {
    setIsUserOverlayVisible(!isUserOverlayVisible);
  };

  return (
    <nav className="fixed left-0 top-0 z-20 w-full bg-purple-950">
      <div className="mx-1 flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/scholarspace-logo-x.png"
            width={100}
            height={100}
            alt="Scholarspace logo"
          />
        </Link>

        {/* Render user information based on the session */}
        <div className="text-white relative">
          {user ? (
            <>
              {/* Display user information */}
              <div className="cursor-pointer" onClick={toggleUserOverlay}>
                <Image src={avatarUrl} width={32} height={32} alt="User avatar" />
              </div>
              {isUserOverlayVisible && (
                <div className="absolute right-0 mt-2 bg-white p-4 rounded-lg shadow">
                  {/* User information content */}
                  <div className="text-sm text-gray-900">
                    <div>{user.user_metadata?.full_name}</div>
                    <div className="font-medium truncate">{user.user_metadata?.email}</div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700">
                    <li className="py-1 hover:bg-gray-100">
                      <p>Manage Account</p>
                    </li>
                    <li className="py-1 hover:bg-gray-100">
                      <p>Settings</p>
                    </li>
                  </ul>
                  <SignoutButton />
                </div>
              )}
            </>
          ) : (
            // Render sign-in button or other content
            <Link href="/signin">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
