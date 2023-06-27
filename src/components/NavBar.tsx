import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export function NavBar() {
  const user = useUser();

  return (
    <nav className="border-gray-200 bg-purple-950 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <span className="self-center whitespace-nowrap text-2xl font-semibold text-white">
            Scholarspace
          </span>
        </Link>
        <div className="hidden md:block md:w-auto" id="navbar-default">
          <ul className="mt-4 flex flex-col font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 ">
            {!user.isSignedIn && (
              <li>
                <SignInButton>
                  <span className="cursor-pointer text-white hover:text-blue-500">
                    Sign In
                  </span>
                </SignInButton>
              </li>
            )}
            <li>
              <UserButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
