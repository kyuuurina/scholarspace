//backup on 14-11-2023 UserProfileForm.tsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/router";
import { type ZodType, z, set } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { api } from "~/utils/api";
import { useRouterId } from "~/utils/routerId";
import toast from "react-hot-toast";

// types
import type { ProfileFormData } from "~/types/profile";

// local components
import FormErrorMessage from "../FormErrorMessage";
import ProfileModal from "../draft/ProfileModal";
import PrimaryButton from "../button/PrimaryButton";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";
import { create } from "domain";

type ProfileModalProps = {
  openModal: boolean;
  onClick: () => void;
};



// const CreateProfileForm: React.FC<ProfileModalProps> = ({ openModal, onClick }) => {
//   const profile_id = useRouterId();

//   const router = useRouter();
//   const { user } = useUser();
//   const supabase = useSupabaseClient();


//   // const createProfile = api.profile.create.useMutation({
//   //   onSuccess: () => {
//   //     toast.custom(() => <SuccessToast message="Project created" />);
//   //     router.reload();
//   //   },
//   //   onError: (error) => {
//   //     toast.custom(() => <ErrorToast message={error.toString()} />);
//   //     onClick();
//   //     reset();
//   //   },
//   // });

//   //form validation schema - matches the ProfileFormData type
//   const schema: ZodType<ProfileFormData>= z.object({
//     name: z
//     .string(),
//     about_me: z.
//     string(),
//     skills: z.
//     string(),
//     achievements: z.
//     string(),
//     education: z.
//     string(),
//     research_experience: z.
//     string(),
//     research_interest: z.
//     string(),
//     collab_status: z.
//     string(),
//     // live_url: z.string().url({ message: "Please enter a valid URL" }),
//   });

//   //react-hook-form
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<ProfileFormData>({
//     resolver: zodResolver(schema),
//   });
// };

//   //handler onSubmit form
//   const onSubmit = async (data: ProfileFormData) => {
//     if {isSubmitting} return;
//     try {
//       setIsSubmitting(true);
//       await createProfile.mutateAsync({
//         ...data,
//         user_id: user?.id,
//         profile_id: profile_id,
//       });
//     }
    
//     const response = await createProfile.mutateAsync({
//       ...FormData,
//       profile_id,
//     });
//     onclick();
//     reset();


// export default CreateProfileForm;