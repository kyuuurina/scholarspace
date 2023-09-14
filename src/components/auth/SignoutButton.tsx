import router from "next/router";
import toast from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

const SignoutButton: React.FC = () => {
  const { supabaseClient } = useSessionContext();

  return (
    <button
      onClick={async () => {
        const { error } = await supabaseClient.auth.signOut();

        if (error) return toast.error("Error signing out. Please try again.");

        void router.push("/signin");
      }}
      className="focus:border-primary focus:ring-primary group flex w-full rounded-lg px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
    >
      Sign Out
    </button>
  );
};

export default SignoutButton;
