import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GoogleIcon } from "~/components/auth/GoogleIcon";

type Props = {
  type: "signin" | "signup";
};

export const GoogleButton: React.FC<Props> = ({ type }) => {
  const supabase = createClientComponentClient();

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <button
      className="border-1 focus:ring-primary flex w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
      type="button"
      onClick={handleGoogleSignUp}
    >
      <div className="flex gap-2">
        <GoogleIcon className="w-4" />
        {type === "signup" ? "signUpGoogle" : "signInGoogle"}
      </div>
    </button>
  );
};
