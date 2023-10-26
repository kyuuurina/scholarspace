import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/router";
import { type ZodType, z, set } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { api } from "~/utils/api";

// types
import type { ResearchPostFormData } from "~/types/researchpost";

// local components
import FormErrorMessage from "../FormErrorMessage";
import Modal from "../modal/Modal";
import PrimaryButton from "../button/PrimaryButton";

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
};

const NewPostModal: React.FC<ModalProps> = ({ openModal, onClick }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();

  // schema for form validation
  const schema: ZodType<ResearchPostFormData> = z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long.")
      .max(100, "Name must be at most 100 characters long."),
    description: z
      .string()
      .min(2, "Description must be at least 2 characters long.")
      .max(200, "Description must be at most 200 characters long."),
    cover_img: z.string().nullable(),
  });
  
   // react-hook-form
   const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResearchPostFormData>();
  
  // handler for onSubmit form
  const onSubmit = async (formData: ResearchPostFormData) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      // Upload the document to the storage bucket
      // if (imageValue && user) {
      //   formData.cover_img = imgId;
      //   const fileUrl = `/${imgId}`;
      //   const { data, error } = await supabase.storage
      //     .from("post-files-upload")
      //     .upload(fileUrl, imageValue);

      //   console.log(error);
      //   console.log(data);
      // }
      const response = await createResearchPost.mutateAsync({
        ...formData,
      });
      onClick();
      reset();
      // setImagePlaceholder(null);


  return (
    <div>
      <Modal
        show={openModal}
        onClose={() => {
          onClick();
          reset();
        }}
        title="Create New Post"
      >
        <form autoComplete="off" className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Title
            </label>
            <input id="title" className="block w-full" {...register("title", { required: true })} />
            {errors.title && <p className="text-red-600">Title is required</p>}
          </div>

          <div>
            <label htmlFor="author" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Author
            </label>
            <input id="author" className="block w-full" {...register("author", { required: true })} />
            {errors.author && <p className="text-red-600">Author is required</p>}
          </div>

          <div>
            <label htmlFor="file" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Upload Files
            </label>
            <input type="file" id="file" {...register("file", { required: true })} />
            {errors.file && <p className="text-red-600">File upload is required</p>}
          </div>

          <PrimaryButton name="Create Post" type="submit" />
        </form>
      </Modal>
    </div>
  );
};

try {
  const { data, error } = await supabase.storage
    .from("post-files-upload")
    .upload(fileUrl, file);

  if (error) {
    throw error;
  }

  const { publicURL } = supabase.storage
    .from("post-files-upload")
    .getPublicUrl(fileUrl);

  return publicURL;
} catch (error) {
  console.error(error);
  throw error;
}

export default NewPostModal;
