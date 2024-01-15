import { type FormEvent, useState } from "react";
import type { NextPage } from "next";
import { type User } from "@supabase/supabase-js";
import { useUser } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";

import { useForm } from "react-hook-form";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// import custom hooks
import { useMultistepForm } from "~/utils/useMultistepForm";

// import custom components
import Button from "~/components/button/Button";
import ErrorToast from "~/components/toast/ErrorToast";
import BasicInfoForm from "~/components/profile-registration/BasicInfoForm";
import AvatarForm from "~/components/profile-registration/AvatarForm";
import ManageTasks from "~/components/profile-registration/ManageTasks";
import RoleForm from "~/components/profile-registration/RoleForm";
import type { FormData } from "~/types/profile";

const INITIAL_DATA: FormData = {
  name: "",
  avatar_url: "",
  about_me: "",
  research_interest: "",
  collab_status: "",
  skills: "",
};

const SignUp: NextPage = () => {
  const router = useRouter();
  const user: User | null = useUser();
  const supabase = useSupabaseClient();
  const [isSelected, setIsSelected] = useState(true);
  const [imageValue, setImageValue] = useState<File | null | undefined>(null);
  const schema: ZodType<FormData> = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long."),
    avatar_url: z.string().nullable(),
    about_me: z.string().nullable(),
    research_interest: z.string().nullable(),
    collab_status: z.string().nullable(),
    skills: z.string().nullable(),
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: INITIAL_DATA,
  });

  const { currentStep, next, back, isFirstStep, isLastStep } = useMultistepForm(
    [
      <BasicInfoForm key={4} register={register} setValue={setValue} />,
      <AvatarForm key={5} setValue={setValue} setImageValue={setImageValue} />,
      <RoleForm key={6} setValue={setValue} />,
    ]
  );

  const createProfileMut = api.profile.create.useMutation();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isLastStep) return next();

    try {
      await createProfileMut.mutateAsync({
        ...getValues(),
      });
      await router.push("/");
    } catch (error) {
      toast.custom(() => {
        if (error instanceof TRPCClientError) {
          return <ErrorToast message={error.message} />;
        } else {
          // Handle other types of errors or fallback to a default message
          return <ErrorToast message="An error occurred." />;
        }
      });
    }

    if (imageValue && getValues().avatar_url !== null) {
      const { data, error } = await supabase.storage
        .from("avatar")
        .upload(getValues().avatar_url || "", imageValue);
    }
  };
  return (
    <>
      {/* layout */}
      <main className="flex min-h-screen flex-col items-center justify-center bg-white lg:flex-row">
        <div className="relative select-none flex-col overflow-hidden bg-gradient-to-bl from-indigo-100 via-purple-100 to-blue-200 lg:flex lg:w-1/2">
          <ManageTasks />
        </div>

        {/* form section  */}
        <div className="w-full bg-white px-12 xl:w-1/2">
          <form onSubmit={onSubmit} autoComplete="off">
            {currentStep}
            <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:justify-end sm:space-x-4 sm:space-y-0 lg:mb-16">
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
