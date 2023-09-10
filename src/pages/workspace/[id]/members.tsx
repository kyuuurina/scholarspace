// not in use anymore!

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Select from "react-select";

// local components
import Layout from "~/components/layout/Layout";
import { Modal } from "~/components/modal/Modal";
import { WorkspaceTabs } from "~/components/workspace/WorkspaceTabs";
import EditableDropDown from "~/components/EditableDropDown";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import { PrimaryButton } from "~/components/button/PrimaryButton";

const Members: NextPageWithLayout = () => {
  // constants
  const router = useRouter();
  const { id } = router.query;
  const user = useUser();
  const userId = user?.id;
  const supabase = useSupabaseClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    label: string;
    value: string;
  } | null>(null);

  // queries and mutation calls

  const { handleSubmit } = useForm();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // users in the system

  const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   async function fetchUsers() {
  //     try {
  //       const { data, error } = await supabase.auth.admin.listUsers();

  //       if (error) {
  //         throw error;
  //       }

  //       setUsers(data.users);
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   }

  //   fetchUsers();
  //   console.log(users);
  // }, []);
  // const userArray: { label: string; value: string }[] = [];

  // members in the workspace
  // const workspaceMembers = api.workspace.listWorkspaceMembers.useQuery({
  //   id: id as string,
  // });

  // if (users.data && workspaceMembers.data) {
  //   const workspaceMemberIds = workspaceMembers.data.map(
  //     (member) => member.userId
  //   );

  //   users.data.forEach((user) => {
  //     const firstEmailAddress = user.emailAddresses[0]?.emailAddress || "";
  //     const userId = user.id;

  //     const isMember = workspaceMemberIds.includes(userId);

  //     // Check if the user is not a member of the workspace
  //     if (!isMember) {
  //       userArray.push({ label: firstEmailAddress, value: userId });
  //     }
  //   });
  // }
  // const addMember = api.member.addMember.useMutation();

  // const onSubmit = async () => {
  //   if (selectedUser) {
  //     const memberId = selectedUser.value;

  //     try {
  //       // Call the addMember procedural function to create a member
  //       await addMember.mutateAsync({
  //         id: memberId,
  //         id: router.query.id as string,
  //       });

  //       // Reset the form and close the modal
  //       setSelectedUser(null);
  //       setModalIsOpen(false);
  //       router.reload();
  //     } catch (error) {
  //       // Handle any errors that occur during member creation
  //       console.error("Failed to create member:", error);
  //     }
  //   }
  // };

  // const handleRoleChange = (memberId: string, newRole: string) => {
  //   updateRole
  //     .mutateAsync({
  //       id: memberId,
  //       role: newRole,
  //     })
  //     .then(() => {
  //       console.log("workspace updated");
  //     })
  //     .catch((error) => {
  //       console.error("Failed to update role:", error);
  //     });
  // };

  // const workspaceMembersArray: {
  //   id: string;
  //   name: string;
  //   email: string;
  //   role: string;
  //   avatarUrl: string;
  // }[] = [];

  // if (workspaceMembers.data) {
  //   workspaceMembers.data.forEach((member) => {
  //     const id = member.userid;
  //     const name = member.users.email;
  //     const email = member.users.email;
  //     const role = member.workspace_role;
  //     const avatarUrl = member.users.raw_user_meta_data?.avatar_url as string;
  //     workspaceMembersArray.push({ id, name, email, role, avatarUrl });
  //   });
  // }

  // const filteredMembers = workspaceMembersArray.filter((member) => {
  //   const memberName = member.name.toLowerCase();
  //   const memberEmail = member.email.toLowerCase();
  //   const query = searchQuery.toLowerCase();
  //   return memberName.includes(query) || memberEmail.includes(query);
  // });

  // const updateRole = api.member.update.useMutation();

  // const deleteMember = api.member.delete.useMutation();

  // const handleDeleteMember = (memberId: string) => {
  //   deleteMember
  //     .mutateAsync({
  //       id: memberId,
  //     })
  //     .then(() => {
  //       router.reload();
  //     });
  // };

  return (
    <>
      {/* <Modal
        title="Add Member"
        show={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="id"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Add Member
            </label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={selectedUser}
              isSearchable={true}
              options={userArray}
              onChange={(choice) => setSelectedUser(choice)}
              isClearable={true}
            />
          </div>

          <PrimaryButton type="submit" name="Add Member" />
        </form>
      </Modal> */}

      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col p-10">
          <h1 className="line-clamp-3 text-4xl">
            Malaysia Special Interest Group in Software Resilience, Quality &
            Automation
          </h1>
          <div className="flex">
            <WorkspaceTabs />
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="mx-4 flex items-center bg-white py-4 dark:bg-gray-800">
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative mr-4">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search-users"
                  className="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                  placeholder="Search for users"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              {/* <button
                onClick={() => {
                  setModalIsOpen(true);
                }}
                className="dark:focus:ring-purple-900y rounded-lg bg-purple-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                Add Member
              </button>
            </div>

            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600"
                  >
                    <td className="flex items-center whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={member.avatarUrl}
                        alt="Jese image"
                      />
                      <div className="pl-3">
                        <div className="text-base font-semibold">
                          {member.name}
                        </div>
                        <div className="font-normal text-gray-500">
                          {member.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <EditableDropDown
                        initialValue={member.role}
                        onValueChange={(newRole) =>
                          handleRoleChange(member.id, newRole)
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      {member.id != userId && (
                        <a
                          href="#"
                          type="button"
                          data-modal-show="removeModal"
                          className="font-medium text-purple-600 hover:underline dark:text-purple-500"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          Remove user
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

Members.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default Members;
