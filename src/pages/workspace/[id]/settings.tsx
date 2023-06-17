/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

// react hooks
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// local components
import EditableText from "~/components/EditableText";
import { WorkspaceTabs } from "~/components/WorkspaceTabs";

const Settings: NextPage = () => {
  const router = useRouter();

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [key, setKey] = useState(0); // Add a key state

  const workspace = api.workspace.get.useQuery(
    {
      workspaceId: router.query.id as string,
    },
    {
      enabled: !!router.query.id,
    }
  );
  const workspaceData = workspace.data;

  useEffect(() => {
    if (workspaceData) {
      setWorkspaceName(workspaceData.name);
      setWorkspaceDescription(workspaceData.description);
      setKey((prevKey) => prevKey + 1); // Increment the key to force re-render
    }
  }, [workspaceData]);

  const updateWorkspace = api.workspace.update.useMutation();

  const handleWorkspaceNameUpdate = (newText: string) => {
    setWorkspaceName(newText);
    updateWorkspace
      .mutateAsync({
        workspaceId: router.query.id as string,
        name: newText,
        description: workspaceDescription,
      })
      .then(() => {
        console.log("workspace updated");
      });
  };

  const deleteWorkspace = api.workspace.delete.useMutation();

  const handleDeleteWorkspace = () => {
    deleteWorkspace
      .mutateAsync({
        workspaceId: router.query.id as string,
      })
      .then(() => {
        router.push("/");
      });
  };

  const handleWorkspaceDescriptionUpdate = (newText: string) => {
    setWorkspaceDescription(newText);
    updateWorkspace
      .mutateAsync({
        workspaceId: router.query.id as string,
        name: workspaceName,
        description: newText,
      })
      .then(() => {
        console.log("workspace updated");
      });
  };

  if (!workspaceData) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col p-10">
          <div className="grid gap-y-5">
            <h1 className="line-clamp-3 text-4xl">
              {workspaceData.name} Settings
            </h1>
            <WorkspaceTabs />
          </div>

          <div className="grid gap-5">
            <div className="max-w mt-2 w-full rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800 sm:p-6 md:p-8">
              <form className="space-y-6" action="#">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                      General Settings
                    </h5>
                  </div>
                  <div className="col-span-2">
                    <div>
                      <label
                        htmlFor="workspace-name"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Workspace Name
                      </label>
                      <EditableText
                        key={key} // Add the key prop
                        text={workspaceName}
                        onUpdate={handleWorkspaceNameUpdate}
                        multiline={false}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="workspace-description"
                        className="mb-2 mt-4 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Workspace Description
                      </label>
                      <EditableText
                        key={key} // Add the key prop
                        text={workspaceDescription}
                        onUpdate={handleWorkspaceDescriptionUpdate}
                        multiline={true}
                      />
                    </div>
                  </div>
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
                        className="w-32 rounded-lg border border-red-700 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
                        onClick={handleDeleteWorkspace}
                      >
                        Delete Project
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

export default Settings;
