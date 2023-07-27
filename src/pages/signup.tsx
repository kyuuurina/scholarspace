/* eslint-disable @typescript-eslint/no-floating-promises */
import { useUser } from "@supabase/auth-helpers-react";
import type { NextPage } from "next";
import Image from "next/image";
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
    <div className="flex min-h-screen min-w-full justify-center">
      <AuthWrapper type="signup">
        <SignUpForm />
      </AuthWrapper>
      <div className="relative hidden min-h-fit flex-1 bg-blue-500 md:block">
        <Image src="/Scholarspace.png" fill={true} alt="cover page" />
      </div>
    </div>
  );
};

export default SignUp;
