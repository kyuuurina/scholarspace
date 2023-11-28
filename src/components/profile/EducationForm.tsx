import { useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
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
import type { ProfileEducationFormData } from "~/types/profile";

// local components
import FormErrorMessage from "../FormErrorMessage";
import PrimaryButton from "../button/PrimaryButton";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";
import Modal from "../modal/Modal";

type ModalProps = {
    openModal: boolean;
    onClick: () => void;
  };

  type EducationFormProps = {
    onSubmit: (formData: ProfileEducationFormData[]) => void;
  };

  const EducationForm: React.FC<EducationFormProps> = ({ onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
  
    const schema: ZodType<ProfileEducationFormData[]> = z.array(
      z.object({
        school_name: z.string().optional(),
        start_date: z.string().optional(),
        end_date: z.string().optional(),
      })
    );
  
    const {
      register,
      handleSubmit,
      control,
      reset,
      formState: { errors },
    } = useForm<ProfileEducationFormData[]>({
      resolver: zodResolver(schema),
      defaultValues: [],
    });
  
    const { fields, append, remove } = useFieldArray({
      control,
      name: "education",
    });
  
    const handleOnSubmit: SubmitHandler<ProfileEducationFormData[]> = async (formData) => {
      if (isSubmitting) return;
      try {
        setIsSubmitting(true);
  
        // Perform any necessary logic before submitting the form
        // ...
  
        onSubmit(formData);
  
        // Perform any necessary logic after submitting the form
        // ...
  
        reset();
        setShowModal(true);
      } catch (error) {
        console.error("Error submitting education form:", error);
        // Handle any errors
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const handleAddRow = () => {
      append({});
    };
  
    const handleRemoveRow = (index: number) => {
      remove(index);
    };
  
    return (
      <div>
        <form autoComplete="off" className="flex flex-col gap-4" onSubmit={handleSubmit(handleOnSubmit)}>
          {/* Form fields for education information */}
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4">
              <div className="flex flex-col">
                <label htmlFor={`education[${index}].school_name`} className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  School Name
                </label>
                <input {...register(`education[${index}].school_name` as const)} className="block w-full" />
                {errors.education && errors.education[index] && errors.education[index].school_name && (
                  <FormErrorMessage text={errors.education[index].school_name.message} />
                )}
              </div>
              {/* Add more form fields for other education information */}
              <div>
                <button type="button" onClick={() => handleRemoveRow(index)} className="text-red-500">
                  Remove
                </button>
              </div>
            </div>
          ))}
  
          <PrimaryButton name="Save Education" type="submit" />
        </form>
  
        <button type="button" onClick={handleAddRow} className="mt-4">
          Add Education
        </button>
  
        {showModal && (
          <Modal
            show={showModal}
            onClose={() => {
              setShowModal(false);
            }}
            title="Success"
          >
            <SuccessToast message="Education information saved successfully." />
          </Modal>
        )}
      </div>
    );
  };
  
  export default EducationForm;