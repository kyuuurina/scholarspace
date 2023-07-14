import { useUser } from "@supabase/auth-helpers-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { AuthWrapper } from "~/components/auth/AuthWrapper";
import { SignInForm } from "~/components/auth/SignInForm";

const SignIn: NextPage = () => {
  const user = useUser();
  const router = useRouter();

  // redirect back to dashboard when user is authenticated
  if (user) {
    void router.push("/");
  }

  return (
    <AuthWrapper type="signin">
      <SignInForm />
    </AuthWrapper>
  );
};

export default SignIn;
