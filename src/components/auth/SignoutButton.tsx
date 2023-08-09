/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import router from "next/router";
import toast from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const SignoutButton: React.FC = () => {
  const { supabaseClient } = useSessionContext();

  return (
    <button
      onClick={async () => {
        const { error } = await supabaseClient.auth.signOut();

        if (error) return toast.error("Error signing out. Please try again.");

        router.push("/signin");
      }}
      className="focus:border-primary focus:ring-primary group flex w-full rounded-lg px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
    >
      Sign Out
    </button>
  );
};
