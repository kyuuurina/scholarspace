/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import router from "next/router";
import { FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";

export const SignoutButton: React.FC = () => {
  const { supabaseClient } = useSessionContext();
  const user = useUser();

  return (
    <div className="space-y-2 px-2 py-2 text-base text-gray-600">
      {user && (
        <div>
          <p className="font-medium">Signed In as: </p>
          <p className="block w-48 break-words font-light">{user.email}</p>
        </div>
      )}
      <button
        onClick={async () => {
          const { error } = await supabaseClient.auth.signOut();

          if (error) return toast.error("Error");

          router.push("/signin");
        }}
        className="focus:border-primary focus:ring-primary group flex w-full items-center rounded-md font-medium hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
      >
        <FiLogOut
          className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
        SignOut
      </button>
    </div>
  );
};
