import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Modal } from "../Modal";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

type ModalProps = {
    openModal: boolean;
    onClick: () => void;
};

type WorkspaceForm = {
  name: string;
  description: string;
  id: string;
};

export const WorkspaceModal: React.FC<ModalProps> = ({ openModal, onClick }) => {
  const { register, handleSubmit, reset } = useForm<WorkspaceForm>();
  const createWorkspace = api.workspace.create.useMutation();
  const router = useRouter();

  const onSubmit = async (formData: WorkspaceForm) => {
    try {
      const response = await createWorkspace.mutateAsync({
        ...formData,
      });

      console.log(response);
      onClick();
      reset();

      // Navigate to the newly created project dashboard
      router.push(`/workspace/${response.id}`);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

//   useEffect(() => {
//     if (createWorkspace.isSuccess) {
//       workspaces.refetch();
//       console.log("Success");
//     }
//   }, [createWorkspace.isSuccess]);

  return (
    <div>
      <Modal show={openModal} onClose={onClick}>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Workspace Name
            </label>
            <input
              id="name"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              {...register("name", { required: true })}
            />
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
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              {...register("description", { required: true })}
            />
          </div>

          <button
            type="submit"
            className="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create
          </button>
        </form>
      </Modal>
    </div>
  );
};
