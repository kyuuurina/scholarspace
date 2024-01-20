import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useUser } from "@supabase/auth-helpers-react";
import dynamic from "next/dynamic";
import { FiAlertTriangle } from "react-icons/fi";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import type { WorkspaceFormData } from "~/types/workspace";

// components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import FormErrorMessage from "~/components/FormErrorMessage";
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";
import Header from "~/components/workspace/Header";
import PageLoader from "~/components/layout/PageLoader";

const LeaveModal = dynamic(() => import("~/components/modal/LeaveModal"), {
  loading: () => null,
  ssr: false,
});

const DeleteWorkspaceModal = dynamic(
  () => import("~/components/workspace/DeleteWorkspaceModal"),
  {
    loading: () => null,
    ssr: false,
  }
);

// utils
import { api } from "~/utils/api";
import { useRouterId } from "~/utils/routerId";
import Link from "next/link";
import { TRPCClientError } from "@trpc/client";

const Settings: NextPageWithLayout = () => {
  // constants
  const user = useUser();
  const id = useRouterId();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [leaveModalIsOpen, setLeaveModalIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const userId = user?.id;

  // fetching data
  // workspace data
  const {
    data: workspace,
    isLoading,
    error,
    refetch,
  } = api.workspace.get.useQuery({
    id: id,
  });

  // workspace role
  const { data: workspaceRole } = api.workspace.getWorkspaceRole.useQuery({
    workspaceId: id,
  });

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

  const updateWorkspace = api.workspace.update.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Workspace updated" />);
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

  // set form values to workspace data
  useEffect(() => {
    if (!isLoading) {
      setValue("name", workspace?.name ?? "");
      setValue("description", workspace?.description ?? "");
      setValue("cover_img", workspace?.cover_img ?? "");
    }
  }, [isLoading, setValue]);

  //handlers
  const handleUpdateWorkspace = async (formData: WorkspaceFormData) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await updateWorkspace.mutateAsync({
        id: id,
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
      name: workspace?.name,
      description: workspace?.description,
      cover_img: workspace?.cover_img,
    });
  };

  const renderLeaveWorkspace = () => {
    const canLeavePersonalWorkspace =
      workspace?.is_personal && userId !== workspace?.ownerid;
    const canLeaveTeamWorkspace = !workspace?.is_personal;
    if (canLeavePersonalWorkspace || canLeaveTeamWorkspace) {
      return (
        <div className="flex justify-between px-2 text-sm">
          <div>
            <p className="mb-1 font-medium">Leave Workspace</p>
            <p className="font-normal">You will lose access to this project.</p>
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
    return null;
  };

  const renderDeleteWorkspace = () => {
    if (!workspace?.is_personal && workspaceRole === "Researcher Admin") {
      return (
        <div className="flex flex-col rounded-sm bg-red-50 p-6 text-sm text-red-800">
          <div className="flex">
            <FiAlertTriangle />
            <div>
              <p className="mb-1 font-medium">Delete Workspace</p>
              <p className="mb-4 font-normal">
                Deleting this workspace will also remove all projects.
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

  if (!workspace) {
    return (
      <>
        <h1 className="text-4xl font-bold">Workspace not found</h1>
        <Link href="/">
          <p className="py-2 text-dark-purple hover:underline">
            Go back to Home page
          </p>
        </Link>
      </>
    );
  }

  return (
    <>
      <Head title={workspace.name} />
      <LeaveModal
        openModal={leaveModalIsOpen}
        onClick={() => setLeaveModalIsOpen(false)}
        name={workspace.name}
        id={id}
      />
      <DeleteWorkspaceModal
        openModal={modalIsOpen}
        onClick={() => setModalIsOpen(false)}
        name={workspace.name}
        id={id}
      />
      <PageLoader isLoading={isLoading} errorMsg={error?.message}>
        <main className="min-h-screen w-full">
          {/* Workspace header */}
          <Header
            name={workspace.name}
            imgUrl={workspace.cover_img}
            purpose="workspace"
          />
          <div className="p-5">
            {/* Update Workspace Section  */}
            <div className="grid gap-y-5">
              <section className="mt-2 w-full rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
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
                      disabled={!isDirty || updateWorkspace.isLoading}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </section>

              {/* Danger Zone Section  */}
              {renderLeaveWorkspace() || renderDeleteWorkspace() ? (
                <section className="w-full rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
                  <form className="space-y-6" action="#">
                    <h5 className="text-xl font-medium text-gray-900">
                      Danger Zone
                    </h5>
                    {renderLeaveWorkspace()}
                    {renderDeleteWorkspace()}
                  </form>
                </section>
              ) : null}
            </div>
          </div>
        </main>
      </PageLoader>
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
