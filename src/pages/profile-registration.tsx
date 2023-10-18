import { type FormEvent, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { User } from "@supabase/supabase-js";
import { useUser } from "@supabase/auth-helpers-react";

// import custom hooks
import { useMultistepForm } from "~/utils/useMultistepForm";

// import custom components
import PrimaryButton from "~/components/button/PrimaryButton";
import { Button } from "~/components/button/Button";
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
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [isSelected, setIsSelected] = useState(true);

  function updateFields(fields: Partial<FormData>) {
    setData((prevData) => ({ ...prevData, ...fields }));
    console.log(fields);
  }

  const { currentStep, next, back, isFirstStep, isLastStep } = useMultistepForm(
    [
      // <RoleForm
      //   key={3}
      //   updateFields={updateFields}
      //   setIsSelected={setIsSelected}
      // />,
      <BasicInfoForm key={4} {...data} updateFields={updateFields} />,
      <ResearchForm key={5} {...data} updateFields={updateFields} />,
    ]
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // Check if a card is selected
    if (!isSelected) {
      // Show an error message or perform any other actions to prompt the user to select a card
      console.log("Please select a collabStatus before proceeding!");
      return;
    }
    if (!isLastStep) return next();
    console.log(data);
  }

  return (
    <>
      {/* layout */}
      <main className="flex flex-col items-center justify-center md:flex-row">
        <div className="mx-auto flex w-full flex-col overflow-hidden bg-blue-200 px-12 py-16 md:min-h-screen md:w-2/4 md:flex-row">
          {/* description section  */}
          <div>
            <p>
              Create a profile record where userId = {user?.id}. Refresh then go
              to index page.{" "}
            </p>
            <SignoutButton />
          </div>
        </div>
        {/* form section  */}
        <div className="w-full bg-white px-12 py-16 md:min-h-screen md:w-1/2">
          <form onSubmit={onSubmit} autoComplete="off">
            {currentStep}
            <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-x-4 sm:space-y-0 lg:mb-16">
              <Button
                name="Go Back"
                onClick={back}
                style="secondary"
                visible={!isFirstStep}
              />
              <Button
                type="submit"
                name={`${isLastStep ? "Submit" : "Next"}`}
              />
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default SignUp;
