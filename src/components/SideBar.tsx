/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// React and Next hooks
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/router";

// clerk
import { useUser } from "@clerk/nextjs";

// icons
import {
  FiHome,
  FiActivity,
  FiMessageCircle,
  FiBriefcase,
} from "react-icons/fi";

import { api } from "~/utils/api";

// components
import { Modal } from "./Modal";

type WorkspaceForm = {
  name: string;
  description: string;
  id: string;
};

export function SideBar() {
  const [open, setOpen] = useState(false);
  const [workspaceMenu, setWorkspaceMenu] = useState(false);
  const router = useRouter();

  const user = useUser();

  const workspaces = api.workspace.list.useQuery();
  const createWorkspace = api.workspace.create.useMutation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<WorkspaceForm>();

  const workspaceArray: { id: string; name: string }[] = workspaces.data
    ? workspaces.data.map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
      }))
    : [];

  const onSubmit = async (formData: WorkspaceForm) => {
    try {
      const response = await createWorkspace.mutateAsync({
        ...formData,
      });

      console.log(response);
      setModalIsOpen(false);
      reset();

      // Navigate to the newly created project dashboard
      router.push(`/workspace/${response.id}`);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleToggleWorkspace = () => {
    setWorkspaceMenu(!workspaceMenu);
  };

  useEffect(() => {
    if (createWorkspace.isSuccess) {
      workspaces.refetch();
    }
  }, [createWorkspace.isSuccess, workspaces.refetch]);

  return (
    <>
      <Modal show={modalIsOpen} onClose={setModalIsOpen}>
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
      <div className="flex flex-row">
        <div
          className={`${
            open ? "w-56" : "w-16"
          } flex min-h-full flex-row overflow-y-auto bg-purple-950 px-2 py-7 shadow duration-300`}
        >
          <div className="min-w-full space-y-3 font-medium">
            <div className="ml-2 flex cursor-pointer items-center">
              <span onClick={handleToggle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </span>
            </div>
            <div className="flex">
              <ul className="min-w-full space-y-1 pb-4 pt-2 text-sm">
                <li className="rounded-sm">
                  <Link
                    className={`flex items-center space-x-3 rounded-md p-2 hover:bg-purple-800 ${
                      open ? "text-gray-100" : "text-gray-100"
                    }`}
                    href="/"
                    onClick={handleToggle}
                  >
                    <FiHome className="h-6 w-6" />
                    <span className={`${open ? "text-gray-100" : "sr-only"}`}>
                      Home
                    </span>
                  </Link>
                </li>
                <li className=" rounded-sm">
                  <Link
                    href="/manage-profile"
                    className={`flex items-center space-x-3 rounded-md p-2 hover:bg-purple-800 ${
                      open ? "text-gray-100" : "text-gray-100"
                    }`}
                    onClick={handleToggle}
                  >
                    <FiActivity className="h-6 w-6" />
                    <span className={`${open ? "text-gray-100" : "sr-only"}`}>
                      My Profile
                    </span>
                  </Link>
                </li>
                <li className="rounded-sm">
                  <Link
                    href="/"
                    className={`flex items-center space-x-3 rounded-md p-2 hover:bg-purple-800 ${
                      open ? "text-gray-100" : "text-gray-100"
                    }`}
                    onClick={handleToggle}
                  >
                    <FiMessageCircle className="h-6 w-6" />
                    <span className={`${open ? "text-gray-100" : "sr-only"}`}>
                      Messages
                    </span>
                  </Link>
                </li>
                <li className="rounded-sm">
                  <Link
                    href="/home-rwp/cljdykk4m0008vu6kufa5klp9"
                    className={`flex items-center space-x-3 rounded-md p-2 hover:bg-purple-800 ${
                      open ? "text-gray-100" : "text-gray-100"
                    }`}
                  >
                    <FiBriefcase className="h-6 w-6" />
                    <span className={`${open ? "" : "sr-only"}`}>Projects</span>
                  </Link>
                </li>
                {open && (
                  <li className="p-2">
                    <hr className="max-w-1/2 m-2 my-6 border-white" />
                    <button
                      className="inline-flex w-44 items-center rounded-sm bg-purple-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-800"
                      type="button"
                      onClick={handleToggleWorkspace}
                    >
                      Switch Workspace{" "}
                      <svg
                        className="ml-2 h-4 w-4"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                    {user.isSignedIn && (
                      <div
                        className={`z-10 ${
                          workspaceMenu ? "" : "hidden"
                        } w-44 divide-y divide-gray-100 rounded-sm bg-white shadow dark:divide-gray-600 dark:bg-gray-700`}
                      >
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                          {workspaceArray.map((workspace) => (
                            <Link
                              key={workspace.id}
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              href={`/workspace/${workspace.id}`}
                            >
                              {workspace.name}
                            </Link>
                          ))}
                        </ul>
                        <div className="w-full py-2">
                          <button
                            onClick={() => {
                              setModalIsOpen(true);
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Add Workspace
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
