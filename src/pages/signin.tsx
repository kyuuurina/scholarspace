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
    <main className="mx-auto flex flex-col items-center justify-center bg-purple-100 px-6 py-8 md:h-screen lg:py-0">
      <AuthWrapper type="signin">
        <SignInForm />
      </AuthWrapper>
    </main>
  );
};

export default SignIn;
