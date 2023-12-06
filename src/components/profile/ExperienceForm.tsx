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
import type { ExperienceFormData } from "~/types/profile";

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

const ExperienceForm: React.FC<ModalProps> = ({ openModal, onClick }) => {
  const experience_id = useRouterId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();

  const experienceMutation = api.experience.createExperience.useMutation();

  // schema for form validation
  const schema: ZodType<ExperienceFormData> = z.object({
    title: z.string().refine((data) => data.trim() !== '', {
      message: "Title is required",
    }),
    start_year: z.string(),
    end_year: z.string(),
    description: z.string().nullable(),
  });

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: null,
    },
  });

  // handler for onSubmit form
  const onSubmit = async (formData: ExperienceFormData) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);

      const response = await experienceMutation.mutateAsync({
        ...formData,
        experience_id,
      });

      if (experienceMutation.error) {
        // Handle error case
        toast.custom(() => <ErrorToast message={experienceMutation.error.toString()} />);
      } else {
        // Handle success case
        toast.custom(() => <SuccessToast message="Research Experience successfully added" />);
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
        title="Research Experience"
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

          <div className="flex gap-4">
            <div className="flex flex-col flex-grow">
              <label
                htmlFor="start_year"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Start Year
              </label>
              <input
                id="start_year"
                className="block w-full"
                {...register("start_year", { required: true })}
              />
              {errors.start_year && (
                <FormErrorMessage text={errors.start_year.message} />
              )}
            </div>

            <div className="flex flex-col flex-grow">
              <label
                htmlFor="end_year"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                End Year
              </label>
              <input
                id="end_year"
                className="block w-full"
                {...register("end_year", { required: true })}
              />
              {errors.end_year && (
                <FormErrorMessage text={errors.end_year.message} />
              )}
            </div>
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

          <PrimaryButton name="Add Research Experience" type="submit" />
        </form>
      </Modal>
    </div>
  );
};

export default ExperienceForm;
