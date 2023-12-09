
//backup on 14-11-2023 UserProfileForm.tsx

//Form to edit NAME, ABOUT ME, SKILLS, RESEARCH INTEREST & COLLAB STATUS

import { useState, useEffect } from "react";
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
import { getCookie } from "cookies-next";

// types
import type { ProfileFormData } from "~/types/profile";

//utils
import { useFetchProfile } from "~/utils/profile";

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
  profile?: {
    profile_id: string;
    name: string;
    about_me: string | null;
    skills: string | null;
    research_interest: string | null;
    collab_status?: string | null;
  };
};

const UserProfileForm: React.FC<ModalProps> = ({ openModal, onClick }) => {

  //const
  const router = useRouter();
  // const  profile_id  = router.query;
  const user = useUser();
  const profile_id = useRouterId();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const userId = getCookie("UserID");

  //custom hooks
  //populate form fields with Profile details
  const {name, about_me, skills,research_interest, collab_status, isLoading} = useFetchProfile();


//schema for form validation
  const schema: ZodType<ProfileFormData> = z.object({
    name: z.string(),
    about_me: z.string().nullable(),
    skills: z.string().nullable(),
    research_interest: z.string().nullable(),
    collab_status: z.string(),
  });

    //react-hook-form
    const {
      register,
      handleSubmit,
      setValue,
      reset,
      formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
      resolver: zodResolver(schema),
      defaultValues :{
        name: name,
        about_me: about_me,
        skills: skills,
        research_interest: research_interest,
        collab_status: collab_status,
      }
    });

    //set form value to profile data
    useEffect(() => {
      if (!isLoading) {
        setValue("name", name || "");
        setValue("about_me", about_me || "");
        setValue("skills", skills || "");
        setValue("research_interest", research_interest || "");
        setValue("collab_status", collab_status || "");

      }
    }, [isLoading, setValue]);

  //toast
  const updateProfile = api.profile.updateProfile.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Profile successfully updated" />);
      router.reload();
    },
    onError: () => {
      toast.custom(() => <ErrorToast message="Error updating profile" />);
    },
  });

  //handlers
  const handleUpdateProfile = async (formData: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        profile_id,
        // profile_id: id,
        ...formData,
      });
      console.log(formData);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  // handle cancel
  const handleCancel = () => {
    reset({
      name: name || "",
      about_me: about_me || "",
      skills: skills || "",
      research_interest: research_interest || "",
      collab_status: collab_status || "",
    });
  };

  const handleEditClick = () => {setIsEditModalOpen(true);};

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
          onSubmit={handleSubmit(handleUpdateProfile)}
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Name
            </label>
            <input className = "w-full" {...register("name")}
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

          <div>
            <label
              htmlFor="research_interest"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Research Interest
            </label>
            <input
              id="research_interest"
              className="block w-full"
              {...register("research_interest", { required: false })}
            />
            {errors.research_interest && (
              <FormErrorMessage text={errors.research_interest.message} />
            )}
          </div>

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
              <option value="Open For Collaboration">Open for Collaboration</option>
              <option value="Not Open For Collaboration">Not Open for Collaboration</option>
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

    // <>
    //     {/* Update Workspace Section */}
    //     <div className="grid gap-y-5">
    //   <section className="mt-2 w-full rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
    //     <form
    //       className="space-y-6"
    //       autoComplete="off"
    //       onSubmit={handleSubmit(handleUpdateProfile)}
    //     >
    //       <h5 className="text-xl font-medium text-gray-900 dark:text-white">
    //         General Settings
    //       </h5>
    //       <div>
    //         <label
    //           htmlFor="name"
    //           className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
    //         >
    //           Name
    //         </label>
    //         <input className="w-full" {...register("name")} />
    //         {errors.name && <FormErrorMessage text={errors.name.message} />}
    //       </div>
    //       {/* Continue with the rest of the form fields... */}
    //       <div className="flex justify-end space-x-3">
    //         {isDirty && (
    //           <button
    //             type="button"
    //             className="rounded-sm border border-gray-200 bg-white px-3 py-2 text-center text-sm font-medium hover:bg-grey-bg hover:text-purple-accent-1 focus:outline-none"
    //             // reverts the input values to the original values
    //             onClick={handleCancel}
    //           >
    //             Cancel
    //           </button>
    //         )}
    //         <button
    //           type="submit"
    //           className={`${
    //             isDirty
    //               ? "bg-purple-accent-1 hover:bg-purple-accent-2"
    //               : "bg-gray-200"
    //           } rounded-sm px-3 py-2 text-center text-sm font-medium text-white focus:outline-none`}
    //           disabled={!isDirty}
    //         >
    //           Save
    //         </button>
    //       </div>
    //     </form>
    //   </section>
    // </div>
    // </>

//  // const schema: ZodType<ProfileFormData> = z.object({
  //   name: z.string(),
  //   about_me: z.string().nullable(),
  //   skills: z.array(z.string()).nullable(),
  //   research_interest: z.array(z.string()).nullable(),
  //   collab_status: z.enum([
  //     "Open_For_Collaboration",
  //     "Not_Open_for_Collaboration",
  //   ]),
  // });
