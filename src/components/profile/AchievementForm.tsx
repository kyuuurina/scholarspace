//following EducationForm.tsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";
import { useRouterId } from "~/utils/routerId";
import toast from "react-hot-toast";

// types
import type { AchievementFormData } from "~/types/profile";

// local components
import FormErrorMessage from "../FormErrorMessage";
import Modal from "../modal/Modal";
import PrimaryButton from "../button/PrimaryButton";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
};

const AchievementForm: React.FC<ModalProps> = ({ openModal, onClick }) => {
  const profile_id = useRouterId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();

  const achievementMutation = api.achievement.createAchievement.useMutation();

  // schema for form validation
  const schema: ZodType<AchievementFormData> = z.object({
    title: z.string().refine((data) => data.trim() !== '', {
      message: "Title is required",
    }),
    received_year: z.string(),
    description: z.string().nullable(),
  });

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AchievementFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: null,
    },
  });

  // handler for onSubmit form
  const onSubmit = async (formData: AchievementFormData) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);

      const response = await achievementMutation.mutateAsync({
        ...formData,
        profile_id,
      });

      if (achievementMutation.error) {
        // Handle error case
        toast.custom(() => <ErrorToast message="Failed to add Achievement" />);
      } else {
        // Handle success case
        toast.custom(() => <SuccessToast message="Achievement successfully added" />);
        router.reload();
      }

      onClick();
      reset();

      setIsSubmitting(false);
    } catch (error) {
      // Handle any other errors
      setIsSubmitting(false);
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
        title="Achievement"
      >
        <form
          autoComplete="off"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title
            </label>
            <input
              id="title"
              className="block w-full"
              {...register("title", { required: true })}
            />
            {errors.title && <FormErrorMessage text={errors.title.message} />}
          </div>


          <div>
            <label
              htmlFor="received_year"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Received Year
            </label>
            <input
              id="received_year"
              className="block w-full"
              {...register("received_year", { required: true })}
            />
            {errors.received_year && <FormErrorMessage text={errors.received_year.message} />}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <textarea
              id="description"
              className="block w-full"
              {...register("description")}
            />
            {errors.description && (
              <FormErrorMessage text={errors.description.message} />
            )}
          </div>

          <PrimaryButton name="Add Achievement" type="submit" />
        </form>
      </Modal>
    </div>
  );
};

export default AchievementForm;
