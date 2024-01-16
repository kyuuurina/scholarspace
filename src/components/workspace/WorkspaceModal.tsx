import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/router";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { api } from "~/utils/api";
import { fetchUserWorkspaces } from "~/utils/userWorkspaces";

// types
import type { WorkspaceFormData } from "~/types/workspace";

// local components
import FormErrorMessage from "../FormErrorMessage";
import Modal from "../modal/Modal";
import PrimaryButton from "../button/PrimaryButton";

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
};

const WorkspaceModal: React.FC<ModalProps> = ({ openModal, onClick }) => {
  // image variables
  const [imagePlaceholder, setImagePlaceholder] = useState<string | null>(null);
  const [imageValue, setImageValue] = useState<File | null | undefined>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imgId: string = uuidv4();

  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();

  const createWorkspace = api.workspace.create.useMutation();
  const { refetch } = fetchUserWorkspaces();
  // schema for form validation
  const schema: ZodType<WorkspaceFormData> = z.object({
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
  } = useForm<WorkspaceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      cover_img: null,
    },
  });

  // handler for onSubmit form
  const onSubmit = async (formData: WorkspaceFormData) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      // Upload the image to the storage bucket
      if (imageValue && user) {
        formData.cover_img = imgId;
        const fileUrl = `/${imgId}`;
        const { data, error } = await supabase.storage
          .from("workspace-covers")
          .upload(fileUrl, imageValue);

  
      }
      const response = await createWorkspace.mutateAsync({
        ...formData,
      });
      onClick();
      reset();
      setImagePlaceholder(null);
      await refetch();
      // Navigate to the newly created project dashboard
      await router.push(`/workspace/${response.id}`);
      setIsSubmitting(false);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  // handler for onChange input for image upload
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files) return;
      const file = e.target.files[0];
      const reader = new FileReader();

      // Read the image as a data URL
      if (file) {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const displayImg = reader.result as string;
          setImagePlaceholder(displayImg);
        };

        setImageValue(file);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Modal
        show={openModal}
        onClose={() => {
          onClick();
          reset();
          setImagePlaceholder(null);
        }}
        title="Add Workspace"
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
              Workspace Name
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
              Workspace Description
            </label>
            <textarea
              id="description"
              className="block w-full"
              {...register("description", { required: true })}
            />
            {errors.description && (
              <FormErrorMessage text={errors.description.message} />
            )}
          </div>

          <div>
            <label
              htmlFor="cImage"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Cover Image
            </label>
            <div className="flex w-full items-center justify-center">
              <label className="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 ">
                {imagePlaceholder ? (
                  <Image
                    src={imagePlaceholder}
                    alt="cover image"
                    style={{ objectFit: "contain" }}
                    fill
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      className="mb-4 h-8 w-8 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG or JPEG
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    void handleOnChange(e);
                  }}
                />
              </label>
            </div>
          </div>

          <PrimaryButton
            name="Create Workspace"
            type="submit"
            disabled={isSubmitting}
          />
        </form>
      </Modal>
    </div>
  );
};

export default WorkspaceModal;
