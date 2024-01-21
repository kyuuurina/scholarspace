import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";
import { MoonLoader } from "react-spinners";
import Link from "next/link";
import { TRPCClientError } from "@trpc/client";
import dynamic from "next/dynamic";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import type { ProjectFormData } from "~/types/project";

// components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import FormErrorMessage from "~/components/FormErrorMessage";
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";
import Header from "~/components/workspace/Header";

const LeaveProjectModal = dynamic(
  () => import("~/components/project/LeaveProjectModal"),
  { loading: () => null, ssr: false }
);

const DeleteProjectModal = dynamic(
  () => import("~/components/project/DeleteProjectModal"),
  { loading: () => null, ssr: false }
);

// utils
import { useRouterId } from "~/utils/routerId";
import { api } from "~/utils/api";

const ProjectSettings: NextPageWithLayout = () => {
  const project_id = useRouterId();

  const [leaveModalIsOpen, setLeaveModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // fetch project data
  const {
    data: project,
    isLoading,
    refetch,
  } = api.project.get.useQuery({
    project_id,
  });

  // fetch project role
  const { data: projectRole } = api.project.getProjectUserRole.useQuery({
    project_id,
  });

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
      name: project?.name,
      description: project?.description,
    },
  });
  // set form values to project data
  useEffect(() => {
    if (!isLoading) {
      setValue("name", project?.name || "");
      setValue("description", project?.description || "");
      setValue("cover_img", project?.cover_img || "");
    }
  }, [isLoading, setValue]);

  // update project
  const updateProject = api.project?.update.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Project updated" />);
    },
  });

  const handleUpdateProject = async (formData: ProjectFormData) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await updateProject.mutateAsync({
        project_id,
        ...formData,
      });
    } catch (error) {
      toast.custom(() => {
        if (error instanceof TRPCClientError) {
          return <ErrorToast message={error.message} />;
        } else {
          return <ErrorToast message="Error in updating workspace." />;
        }
      });
    } finally {
      reset({
        ...formData,
      });
      await refetch();
    }
    setIsUpdating(false);
  };

  const handleCancel = () => {
    reset({
      name: project?.name,
      description: project?.description,
      cover_img: project?.cover_img,
    });
  };

  const renderLeaveProject = () => {
    if (
      !projectRole?.is_external_collaborator &&
      projectRole?.project_role !== "Researcher Admin"
    ) {
      return (
        <div className="flex justify-between px-2 text-sm">
          <div>
            <p className="mb-1 font-medium">Leave Workspace</p>
            <p className="font-normal">
              You will lose access to this project?.
            </p>
          </div>
          <button
            type="button"
            className="w-auto rounded-sm border border-gray-700 p-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-800 hover:text-white focus:outline-none"
            onClick={() => setLeaveModalIsOpen(true)}
          >
            Leave Workspace
          </button>
        </div>
      );
    }
  };

  const renderDeleteProject = () => {
    if (projectRole?.project_role === "Researcher Admin") {
      return (
        <div className="flex flex-col rounded-sm bg-red-50 p-6 text-sm text-red-800">
          <div className="flex">
            <FiAlertTriangle className="text-red-800" />
            <div>
              <p className="mb-1 font-medium">Delete Project</p>
              <p className="mb-4 font-normal">
                Deleting this project will also remove all tasks.
              </p>
              <button
                type="button"
                className="w-auto rounded-sm border border-red-700 p-2 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none"
                onClick={() => setDeleteModalIsOpen(true)}
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <MoonLoader color="#7C3AED" />
      </div>
    );
  }

  if (!project) {
    return (
      <>
        <main className="flex min-h-screen w-full flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Project not found</h1>
          <Link href="/">
            <p className="py-2 text-dark-purple hover:underline">
              Go back to Home page
            </p>
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Head title={project?.name} />
      <LeaveProjectModal
        openModal={leaveModalIsOpen}
        onClick={() => setLeaveModalIsOpen(false)}
        name={project?.name}
        id={project_id}
      />
      <DeleteProjectModal
        openModal={deleteModalIsOpen}
        onClick={() => setDeleteModalIsOpen(false)}
        name={project?.name}
        id={project_id}
      />
      <main className="min-h-screen w-full">
        {/* Workspace header */}
        <Header
          name={project?.name}
          imgUrl={project?.cover_img}
          purpose="project"
        />
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
                    disabled={!isDirty || updateProject?.isLoading}
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
                {renderLeaveProject()}
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
