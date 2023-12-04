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

// types
import type { EducationFormData } from "~/types/profile";

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

const EducationModal: React.FC<ModalProps> = ({ openModal, onClick }) => {
  const education_id = useRouterId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();

  const createEducation = api.education.create.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Education successfully added" />);
      router.reload();
    },
    onError: (error) => {
      toast.custom(() => <ErrorToast message={error.toString()} />);
      onClick();
      reset();
    },
  });

  // schema for form validation
  const schema: ZodType<EducationFormData> = z.object({
    school: z.string(),
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
  } = useForm<EducationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: null,
    },
  });

  // handler for onSubmit form
  const onSubmit = async (formData: EducationFormData) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);

      const response = await createEducation.mutateAsync({
        ...formData,
        education_id,
      });

      onClick();
      reset();

      // Additional actions after successful submission if needed

      setIsSubmitting(false);
    } catch (error) {
      // Handle any errors
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
        title="Add Education"
      >
        <form
          autoComplete="off"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="school"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              School
            </label>
            <input
              id="school"
              className="block w-full"
              {...register("school", { required: true })}
            />
            {errors.school && <FormErrorMessage text={errors.school.message} />}
          </div>

          <div>
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

          <div>
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

          <PrimaryButton name="Add Education" type="submit" />
        </form>
      </Modal>
    </div>
  );
};

export default EducationModal;


  // type EducationFormProps = {
  //   onSubmit: (formData: EducationFormData[]) => void;
  // };

  // const EducationForm: React.FC<EducationFormProps> = ({ onSubmit }) => {
  //   const [isSubmitting, setIsSubmitting] = useState(false);
  //   const [showModal, setShowModal] = useState(false);
  
  //   const schema: ZodType<EducationFormData[]> = z.array(
  //     z.object({
  //       school_name: z.string().optional(),
  //       start_date: z.string().optional(),
  //       end_date: z.string().optional(),
  //     })
  //   );
  
  //   const {
  //     register,
  //     handleSubmit,
  //     control,
  //     reset,
  //     formState: { errors },
  //   } = useForm<EducationFormData[]>({
  //     resolver: zodResolver(schema),
  //     defaultValues: [],
  //   });
  
  //   const { fields, append, remove } = useFieldArray({
  //     control,
  //     name: "education",
  //   });
  
  //   const handleOnSubmit: SubmitHandler<EducationFormData[]> = async (formData) => {
  //     if (isSubmitting) return;
  //     try {
  //       setIsSubmitting(true);
  
  //       // Perform any necessary logic before submitting the form
  //       // ...
  
  //       onSubmit(formData);
  
  //       // Perform any necessary logic after submitting the form
  //       // ...
  
  //       reset();
  //       setShowModal(true);
  //     } catch (error) {
  //       console.error("Error submitting education form:", error);
  //       // Handle any errors
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };
  
  //   const handleAddRow = () => {
  //     append({});
  //   };
  
  //   const handleRemoveRow = (index: number) => {
  //     remove(index);
  //   };
  
  //   return (
  //     <div>
  //       <form autoComplete="off" className="flex flex-col gap-4" onSubmit={handleSubmit(handleOnSubmit)}>
  //         {/* Form fields for education information */}
  //         {fields.map((field, index) => (
  //           <div key={field.id} className="flex gap-4">
  //             <div className="flex flex-col">
  //               <label htmlFor={`education[${index}].school_name`} className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
  //                 School Name
  //               </label>
  //               <input {...register(`education[${index}].school_name` as const)} className="block w-full" />
  //               {errors.education && errors.education[index] && errors.education[index].school_name && (
  //                 <FormErrorMessage text={errors.education[index].school_name.message} />
  //               )}
  //             </div>
  //             {/* Add more form fields for other education information */}
  //             <div>
  //               <button type="button" onClick={() => handleRemoveRow(index)} className="text-red-500">
  //                 Remove
  //               </button>
  //             </div>
  //           </div>
  //         ))}
  
  //         <PrimaryButton name="Save Education" type="submit" />
  //       </form>
  
  //       <button type="button" onClick={handleAddRow} className="mt-4">
  //         Add Education
  //       </button>
  
  //       {showModal && (
  //         <Modal
  //           show={showModal}
  //           onClose={() => {
  //             setShowModal(false);
  //           }}
  //           title="Success"
  //         >
  //           <SuccessToast message="Education information saved successfully." />
  //         </Modal>
  //       )}
  //     </div>
  //   );
  // };
  
  // export default EducationForm;