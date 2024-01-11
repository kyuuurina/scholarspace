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

// types
import type { ProfileFormData } from "~/types/profile";
import type { AchievementFormData } from "~/types/profile";

//utils
import { useFetchProfile } from "~/utils/profile";
import { useFetchAchievement } from "~/utils/achievement";

// local components
import FormErrorMessage from "../FormErrorMessage";
import PrimaryButton from "../button/PrimaryButton";
import Modal from "../modal/Modal";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
  achievement: {
    achievement_id: string;
    title: string;
    received_year: string;
    description: string | null;
    user_id: string;
    isLoading: boolean;
  };
};

const EditAchievement: React.FC<ModalProps> = ({
  achievement,
  openModal,
  onClick,
}) => {
  //const
  const router = useRouter();
  // const  profile_id  = router.query;
  const user = useUser();
  const profile_id = useRouterId();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const userId = user?.id || "";

  //populate form fields
  const { title, received_year, description, achievement_id, isLoading } =
    achievement;

  //schema for form validation
  const schema: ZodType<AchievementFormData> = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    received_year: z.string().min(1, { message: "Year is required" }),
    description: z.string().nullable(),
  });

  //react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<AchievementFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: title,
      received_year: received_year,
      description: description,
    },
  });

  //set form value to profile data
  useEffect(() => {
    if (!isLoading) {
      setValue("title", title || "");
      setValue("received_year", received_year || "");
      setValue("description", description || "");
    }
  }, [isLoading, setValue]);

  //toast
  const updateAchievement = api.achievement.updateAchievement.useMutation({
    onSuccess: () => {
      toast.custom(() => (
        <SuccessToast message="Achievement successfully updated" />
      ));
      router.reload();
    },
    onError: () => {
      toast.custom(() => <ErrorToast message="Error updating achievement" />);
    },
  });

  //handlers
  const handleUpdateAchievement = async (formData: AchievementFormData) => {
    try {
      await updateAchievement.mutateAsync({
        achievement_id,
        // profile_id,
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
      title: title || "",
      received_year: received_year || "",
      description: description || "",
    });
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
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
          onSubmit={handleSubmit(handleUpdateAchievement)}
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
            {errors.received_year && (
              <FormErrorMessage text={errors.received_year.message} />
            )}
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

          {/* Buttons container with justify-end */}
          <div className="flex justify-end gap-4">
            {/* Save button */}
            <PrimaryButton name="Save" type="submit" />

            {/* Cancel button */}
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-gray-400 px-4 py-2 font-bold text-gray-800 hover:bg-gray-500"
              onClick={() => {
                onClick();
                handleCancel();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EditAchievement;
