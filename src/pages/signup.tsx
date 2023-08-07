/* eslint-disable @typescript-eslint/no-floating-promises */
import { useUser } from "@supabase/auth-helpers-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { AuthWrapper } from "~/components/auth/AuthWrapper";
import { SignUpForm } from "~/components/auth/SignUpForm";

const SignUp: NextPage = () => {
  const user = useUser();
  const router = useRouter();

  // redirect back to dashboard when user is authenticated
  if (user) {
    router.push("/");
  }

  return (
    <main className="mx-auto flex flex-col items-center justify-center bg-purple-100 px-6 py-8 md:h-screen lg:py-0">
      <AuthWrapper type="signup">
        <SignUpForm />
      </AuthWrapper>
    </main>
  );
};

export default SignUp;
