/* eslint-disable @typescript-eslint/no-floating-promises */
import { useUser } from "@supabase/auth-helpers-react";
import type { NextPage } from "next";

import { SignoutButton } from "~/components/auth/SignoutButton";

const SignUp: NextPage = () => {
  const user = useUser();

  return (
    <main className="mx-auto flex flex-col items-center justify-center bg-purple-100 px-6 py-8 md:h-screen lg:py-0">
      <p>Create a profile record where userId = {user?.id}. Refresh then go to index page. </p>
      <SignoutButton />
    </main>
  );
};

export default SignUp;
