/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

//backup on 14-11-2023 UserProfileForm.tsx

//Form for NAME, ABOUT ME, SKILLS, RESEARCH INTEREST & COLLAB STATUS
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { api } from "~/utils/api";
import { useRouterId } from "~/utils/routerId";
import toast from "react-hot-toast";
import React from "react";

// types
import type { ProfileFormData } from "~/types/profile";

// local components
import FormErrorMessage from "../FormErrorMessage";
import ProfileModal from "../draft/ProfileModal";
import PrimaryButton from "../button/PrimaryButton";
import Modal from "../modal/Modal";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";

type ProfileModalProps = {
  openModal: boolean;
  onClick: () => void;
};

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
};

const UserProfileForm: React.FC<ModalProps> = ({ openModal, onClick }) => {
  const profile_id = useRouterId();

  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const createProfile = api.profile.create.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Profile created" />);
      router.reload();
    },
    onError: (error: { toString: () => string }) => {
      toast.custom(() => <ErrorToast message={error.toString()} />);
      onClick();
      reset();
    },
  });

  //schema for form validation
  const schema: ZodType<ProfileFormData> = z.object({
    name: z.string(),
    about_me: z.string().nullable(),
    skills: z.array(z.string()).nullable(),
    research_interest: z.array(z.string()).nullable(),
    collab_status: z.enum([
      "Open_For_Collaboration",
      "Not_Open_for_Collaboration",
    ]),
  });

  //react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
  });

  //handler onSubmit form
  const onSubmit = async (formData: ProfileFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      console.log(errors);
      console.log(formData);
    } catch {
      const response = await createProfile.mutateAsync({
        ...formData,
        user_id: user?.id,
        profile_id: profile_id,
      });
      onClick();
      reset();
    }
  };

  return (
    <div>
      <Modal
        show={openModal}
        onClose={() => {
          onClick();
          reset();
        }}
        title="My Profile"
      >
        <form
          autoComplete="off"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Name
            </label>
            <input
              id="name"
              className="block w-full"
              {...register("name", { required: true })}
            />
            {errors.name && <FormErrorMessage text={errors.name.message} />}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              About Me
            </label>
            <textarea
              id="description"
              className="block w-full"
              {...register("about_me", { required: true })}
            />
            {errors.about_me && (
              <FormErrorMessage text={errors.about_me.message} />
            )}
          </div>

          <div>
            <label
              htmlFor="skills"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Skills
            </label>
            <input
              id="skills"
              className="block w-full"
              {...register("skills", { required: false })}
            />
            {errors.skills && (
              <FormErrorMessage text={errors.skills.message} />
            )}
          </div>

          {/* <div>
            <label
              htmlFor="skills"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Research Interest
            </label>
            <input
              id="research_interest"
              className="block w-full"
              {...register("research_interest", { required: false })}
            />
            {errors.skills && (
              <FormErrorMessage text={errors.research_interest.message} />
            )}
          </div> */}

          <div>
            <label
              htmlFor="collab_status"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Collaboration Status
            </label>
            <select
              id="collab_status"
              className="block w-full"
              {...register("collab_status", { required: true })}
            >
              <option value="Open_For_Collaboration">Open for Collaboration</option>
              <option value="Not_Open_for_Collaboration">Not Open for Collaboration</option>
            </select>
            {errors.collab_status && (
              <FormErrorMessage text={errors.collab_status.message} />
            )}
          </div>


          <PrimaryButton name="Update My Profile" type="submit" />
        </form>
      </Modal>
    </div>
  );
};

export default UserProfileForm;
