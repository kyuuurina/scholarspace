import { type FormEvent, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { User } from "@supabase/supabase-js";
import { useUser } from "@supabase/auth-helpers-react";

// import custom hooks
import { useMultistepForm } from "~/hooks/useMultistepForm";

// import custom components
import PrimaryButton from "~/components/button/PrimaryButton";
// import { RoleForm } from "~/components/profile-registration/RoleForm";
import { BasicInfoForm } from "~/components/profile-registration/BasicInfoForm";
import { ResearchForm } from "~/components/profile-registration/ResearchForm";

type FormData = {
  // collabStatus: string;
  name: string;
  education: string;
  // contactNum: string;
  aboutMe: string;
  researchInterest: string[];
};

const INITIAL_DATA: FormData = {
  // collabStatus: "",
  name: "",
  education: "",
  // contactNum: "",
  aboutMe: "",
  researchInterest: [],
};

import SignoutButton from "~/components/auth/SignoutButton";

const SignUp: NextPage = () => {
  const user: User | null = useUser();

  return (
    <main className="mx-auto flex flex-col items-center justify-center bg-purple-100 px-6 py-8 md:h-screen lg:py-0">
      <p>
        Create a profile record where userId = {user?.id}. Refresh then go to
        index page.{" "}
      </p>
      <SignoutButton />
    </main>
  );
};

export default SignUp;
