import { MoonLoader } from "react-spinners";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import toast from "react-hot-toast";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";
import React from "react";

type InviteUserButtonProps = {
  email: string;
  onSuccess?: () => void;
};

const InviteUserButton: React.FC<InviteUserButtonProps> = ({
  email,
  onSuccess,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY || ""
  );

  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);

  const inviteUser = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.admin.inviteUserByEmail(email);
    if (error) {
      toast.custom(() => <ErrorToast message="Error inviting user" />);
      setErrorMessage(error.message);
    } else {
      toast.custom(() => <SuccessToast message="Successfully invited user" />);
      onSuccess && onSuccess();
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={inviteUser}
      className={`rounded-sm bg-blue-500 px-4 py-2 hover:bg-blue-700
        ${isLoading ? "opacity-50" : ""}
        `}
      disabled={isLoading}
    >
      <div className="flex items-center justify-between">
        <span className="px-2 text-white">Invite</span>
        {isLoading && (
          <MoonLoader
            color={"#ffff"}
            loading={true}
            aria-label="FadeLoader"
            data-testid="loader"
            size={20}
          />
        )}
      </div>
    </button>
  );
};

export default InviteUserButton;
