import { useForm } from "react-hook-form";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../Modal";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Button } from "../Button";
import { FormErrorMessage } from "../FormErrorMessage";

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
};

type WorkspaceFormData = {
  name: string;
  description: string;
  cover_img: string;
};

export const WorkspaceModal: React.FC<ModalProps> = ({
  openModal,
  onClick,
}) => {
  const createWorkspace = api.workspace.create.useMutation();
  const router = useRouter();

  const schema: ZodType<WorkspaceFormData> = z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long.")
      .max(100, "Name must be at most 100 characters long."),
    description: z
      .string()
      .min(2, "Description must be at least 2 characters long.")
      .max(200, "Description must be at most 200 characters long."),
    cover_img: z
      .string()
      .min(2, "Cover image must be at least 2 characters long.")
      .max(100, "Cover image must be at most 100 characters long."),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkspaceFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData: WorkspaceFormData) => {
    try {
      const response = await createWorkspace.mutateAsync({
        ...formData,
      });

      console.log(response);
      onClick();
      reset();

      // Navigate to the newly created project dashboard
      await router.push(`/workspace/${response.id}`);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  return (
    <div>
      <Modal show={openModal} onClose={onClick}>
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
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Workspace Description
            </label>
            <textarea
              id="description"
              className="block w-full "
              {...register("cover_img", { required: true })}
            />
            {errors.cover_img && (
              <FormErrorMessage text={errors.cover_img.message} />
            )}
          </div>

          <Button name="Create Workspace" type="submit" />
        </form>
      </Modal>
    </div>
  );
};
