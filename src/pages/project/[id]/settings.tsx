import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import type { ProjectFormData } from "~/types/project";

// components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import FormErrorMessage from "~/components/FormErrorMessage";
import { DeleteWorkspaceModal } from "~/components/workspace/DeleteWorkspaceModal";
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";
import Header from "~/components/workspace/Header";
import { useFetchWorkspace } from "~/utils/workspace";
import LeaveModal from "~/components/modal/LeaveModal";
import LoadingSpinner from "~/components/LoadingSpinner";
import ErrorPage from "~/pages/error-page";

// utils
import { useGetWorkspaceRole } from "~/utils/userWorkspaces";
import { useFetchProject } from "~/utils/project";

const ProjectSettings: NextPageWithLayout = () => {
  // constants
  const userWorkspaceRole = useGetWorkspaceRole();
  const router = useRouter();
  const { id } = router.query;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [leaveModalIsOpen, setLeaveModalIsOpen] = useState(false);
  const userId = getCookie("UserID");

  const { name, description, isLoading, error, imgUrl, cover_img } =
    useFetchProject();
  // schema for form validation
  const schema: ZodType<ProjectFormData> = z.object({
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
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: name,
      description: description,
    },
  });
  // set form values to workspace data
  useEffect(() => {
    if (!isLoading) {
      setValue("name", name || "");
      setValue("description", description || "");
      setValue("cover_img", cover_img || "");
    }
  }, [isLoading, setValue]);

  const updateProject = api.project.update.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Project updated" />);
      router.reload();
    },
    onError: () => {
      toast.custom(() => <ErrorToast message="Error updating project" />);
    },
  });

  //handlers
  const handleUpdateProject = async (formData: ProjectFormData) => {
    try {
      await updateProject.mutateAsync({
        project_id: id as string,
        ...formData,
      });
      console.log(formData);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  const handleCancel = () => {
    reset({
      name: name || "",
      description: description || "",
      cover_img: cover_img || "",
    });
  };

  //   const renderLeaveWorkspace = () => {
  //     if (canLeavePersonalWorkspace || canLeaveTeamWorkspace) {
  //       return (
  //         <div className="flex justify-between px-2 text-sm">
  //           <div>
  //             <p className="mb-1 font-medium">Leave Workspace</p>
  //             <p className="font-normal">You will lose access to this project.</p>
  //           </div>
  //           <button
  //             type="button"
  //             className="w-auto rounded-sm border border-gray-700 p-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-800 hover:text-white focus:outline-none"
  //             onClick={() => setLeaveModalIsOpen(true)}
  //           >
  //             Leave Workspace
  //           </button>
  //         </div>
  //       );
  //     }
  //     return null;
  //   };

  const renderDeleteProject = () => {
    if (userWorkspaceRole === "Researcher Admin") {
      return (
        <div className="flex flex-col rounded-sm bg-red-50 p-6 text-sm text-red-800">
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
              <p className="mb-1 font-medium">Delete Project</p>
              <p className="mb-4 font-normal">
                Deleting this project will also remove all tasks.
              </p>
              <button
                type="button"
                className="w-auto rounded-sm border border-red-700 p-2 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none"
                onClick={() => setModalIsOpen(true)}
              >
                Delete Workspace
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  return (
    <>
      <Head title={name ? `${name} Settings` : "Settings"} />
      <LeaveModal
        openModal={leaveModalIsOpen}
        onClick={() => setLeaveModalIsOpen(false)}
        name={name}
        id={id as string}
      />
      <DeleteWorkspaceModal
        openModal={modalIsOpen}
        onClick={() => setModalIsOpen(false)}
        name={name}
        id={id as string}
      />
      <main className="min-h-screen w-full">
        {/* Workspace header */}
        <Header name={name || ""} imgUrl={imgUrl} purpose="project" />
        <div className="p-5">
          {/* Update Workspace Section  */}
          <div className="grid gap-y-5">
            <section className="mt-2 w-full rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
              <form
                className="space-y-6"
                autoComplete="off"
                onSubmit={handleSubmit(handleUpdateProject)}
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
                  <input className="w-full" {...register("name")} />
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
                  <textarea className="w-full" {...register("description")} />
                  {errors.description && (
                    <FormErrorMessage text={errors.description.message} />
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  {isDirty && (
                    <button
                      type="button"
                      className="rounded-sm border border-gray-200 bg-white px-3 py-2 text-center text-sm font-medium hover:bg-grey-bg hover:text-purple-accent-1 focus:outline-none"
                      // reverts the input values to the original values
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`${
                      isDirty
                        ? "bg-purple-accent-1 hover:bg-purple-accent-2"
                        : "bg-gray-200"
                    } rounded-sm px-3 py-2 text-center text-sm font-medium text-white focus:outline-none`}
                    disabled={!isDirty}
                  >
                    Save
                  </button>
                </div>
              </form>
            </section>

            {/* Danger Zone Section  */}
            <section className="w-full rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
              <form className="space-y-6" action="#">
                <h5 className="text-xl font-medium text-gray-900">
                  Danger Zone
                </h5>
                {renderDeleteProject()}
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

ProjectSettings.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default ProjectSettings;
