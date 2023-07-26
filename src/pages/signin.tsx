import { useUser } from "@supabase/auth-helpers-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";

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
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          src="/Scholarspace.png"
          width={500}
          height={500}
          alt="registration landing page"
        />
      </div>

      <SignInForm />
    </AuthWrapper>
  );
};

export default SignIn;
