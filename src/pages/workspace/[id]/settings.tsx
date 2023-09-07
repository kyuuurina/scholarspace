/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { NextPageWithLayout } from "~/pages/_app";
import { useRouter } from "next/router";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

// types
import type { WorkspaceFormData } from "~/types/workspace";

// components
import Layout from "~/components/layout/Layout";
import { Head } from "~/components/layout/Head";
import { WorkspaceTabs } from "~/components/workspace/WorkspaceTabs";
import { FormErrorMessage } from "~/components/FormErrorMessage";
import { DeleteWorkspaceModal } from "~/components/workspace/DeleteWorkspaceModal";
import { SuccessToast } from "~/components/toast/SuccessToast";
import { ErrorToast } from "~/components/toast/ErrorToast";

const Settings: NextPageWithLayout = () => {
  // constants
  const router = useRouter();
  const { id } = router.query;
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  // define functions
  const { data: workspace, isLoading } = api.workspace.get.useQuery(
    {
      id: id as string,
    },
    {
      enabled: !!id,
    }
  );

  const updateWorkspace = api.workspace.update.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Workspace updated" />);
      router.reload();
    },
    onError: () => {
      toast.custom(() => <ErrorToast message="Error updating workspace" />);
    },
  });

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<WorkspaceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: workspace?.name,
      description: workspace?.description,
      cover_img: workspace?.cover_img,
    },
  });

  useEffect(() => {
    if (!isLoading && workspace) {
      setValue("name", workspace.name || "");
      setValue("description", workspace.description || "");
      setValue("cover_img", workspace.cover_img || "");
    }
  }, [isLoading, workspace, setValue]);

  const handleUpdateWorkspace = async (formData: WorkspaceFormData) => {
    try {
      await updateWorkspace.mutateAsync({
        id: id as string,
        ...formData,
      });
      console.log(formData);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleCancel = () => {
    reset({
      name: workspace?.name || "",
      description: workspace?.description || "",
      cover_img: workspace?.cover_img || "",
    });
  };

  return (
    <>
      <Head title={`${workspace?.name} Settings`} />
      <DeleteWorkspaceModal
        openModal={modalIsOpen}
        onClick={() => setModalIsOpen(false)}
        name={workspace?.name}
        id={id}
      />
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col p-10">
          <div className="grid gap-y-5">
            <h1 className="line-clamp-3 text-4xl">
              {workspace?.name} Settings
            </h1>
            <WorkspaceTabs />
          </div>

          <div className="grid gap-5">
            <div className="max-w mt-2 w-full rounded-lg border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
              <form
                className="space-y-6"
                autoComplete="off"
                onSubmit={handleSubmit(handleUpdateWorkspace)}
              >
                <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                  General Settings
                </h5>
                <div>
                  <label
                    htmlFor="workspace-name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Workspace Name
                  </label>
                  <input {...register("name")} />
                  {errors.name && (
                    <FormErrorMessage text={errors.name.message} />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="workspace-description"
                    className="mb-2 mt-4 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Workspace Description
                  </label>
                  <textarea {...register("description")} />
                  {errors.description && (
                    <FormErrorMessage text={errors.description.message} />
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className={`${
                      isDirty ? "bg-red-500 hover:bg-red-600" : "bg-grey-100"
                    } rounded px-4 py-2 text-white`}
                    // reverts the input values to the original values
                    onClick={handleCancel}
                    disabled={!isDirty}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`${
                      isDirty
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-grey-100"
                    } rounded px-4 py-2 text-white`}
                    disabled={!isDirty}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
            <div className="max-w w-full rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800 sm:p-6 md:p-8">
              <form className="space-y-6" action="#">
                <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                  Danger Zone
                </h5>
                <div className="flex flex-col rounded-lg bg-red-50 p-6 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400">
                  <div className="flex">
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      ></path>
                    </svg>
                    <div>
                      <p className="mb-1 font-medium">Delete Workspace</p>
                      <p className="mb-4 font-normal">
                        Deleting this workspace will also remove all projects.
                      </p>
                      <button
                        type="button"
                        className="w-auto rounded-lg border border-red-700 p-2 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none"
                        onClick={() => setModalIsOpen(true)}
                      >
                        Delete Workspace
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default Settings;
