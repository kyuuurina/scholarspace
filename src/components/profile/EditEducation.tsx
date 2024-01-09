


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
import type { EducationFormData } from "~/types/profile";

//utils
import { useFetchEducation } from "~/utils/education";

// local components
import FormErrorMessage from "../FormErrorMessage";
import PrimaryButton from "../button/PrimaryButton";
import Modal from "../modal/Modal";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
  education: {
    education_id: string;
    school: string;
    start_year: string;
    end_year: string;
    description: string | null;
    user_id: string;
    isLoading: boolean;
  };
};

const EditEducation: React.FC<ModalProps> = ({ education, openModal, onClick }) => {

  //const
  const router = useRouter();
  // const  profile_id  = router.query;
  const user = useUser();
  const profile_id = useRouterId();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const userId = getCookie("UserID");

  //populate form fields
  const {education_id, school, start_year, end_year, description, isLoading} = education;


//schema for form validation
  const schema: ZodType<EducationFormData> = z.object({
    school: z.string().min(1, { message: "Title is required" }),
    start_year: z.string().min(1, { message: "Start Year is required" }),
    end_year: z.string().min(1, { message: "End Year is required" }),
    description: z.string().nullable(),
  });

    //react-hook-form
    const {
      register,
      handleSubmit,
      setValue,
      reset,
      formState: { errors, isDirty },
    } = useForm<EducationFormData>({
      resolver: zodResolver(schema),
      defaultValues :{
        school,
        start_year,
        end_year,
        description,
      }
    });

    //set form value to profile data
    useEffect(() => {
      if (!isLoading) {
        setValue("school", school || "");
        setValue("start_year", start_year || "");
        setValue("end_year", end_year || "");
        setValue("description", description || "");

      }
    }, [isLoading, setValue]);

  //toast
  const updateEducation = api.education.updateEducation.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Education successfully updated" />);
      router.reload();
    },
    onError: () => {
      toast.custom(() => <ErrorToast message="Error updating Education" />);
    },
  });

  //handlers
  const handleUpdateEducation = async (formData: EducationFormData) => {
    try {
      await updateEducation.mutateAsync({
        education_id, 
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
      school: school || "",
      start_year: start_year || "",
      end_year: end_year || "",
      description: description || "",
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
        title="Education"
      >
        <form
          autoComplete="off"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleUpdateEducation)}
        >
          <div>
            <label
              htmlFor="school"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Instituition
            </label>
            <input
              id="school"
              className="block w-full"
              {...register("school", { required: true })}
            />
            {errors.school && <FormErrorMessage text={errors.school.message} />}
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


        {/* Buttons container with justify-end */}
        <div className="flex justify-end gap-4">
          {/* Save button */}
          <PrimaryButton name="Save" type="submit" />

          {/* Cancel button */}
          <button
            type="button"
            className="bg-gray-400 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded-lg inline-flex items-center"
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

export default EditEducation;