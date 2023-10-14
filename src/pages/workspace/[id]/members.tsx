import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Select from "react-select";
import toast from "react-hot-toast";
import Image from "next/image";

// local components
import Layout from "~/components/layout/Layout";
import Modal from "~/components/modal/Modal";
import EditableDropDown from "~/components/EditableDropDown";
import Header from "~/components/workspace/Header";
import PrimaryButton from "~/components/button/PrimaryButton";
import { SuccessToast } from "~/components/toast/SuccessToast";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// utils
import { useFetchWorkspace, useFetchWorkspaceMembers } from "~/utils/workspace";
import { useFetchUsers } from "~/utils/user";
import { useRouterId } from "~/utils/routerId";
import { router } from "~/server/api/trpc";

const Members: NextPageWithLayout = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { name, isLoading, imgUrl } = useFetchWorkspace();
  const workspaceId = useRouterId();
  const router = useRouter();
  const user = useUser();

  // members in the workspace
  const { workspaceMembers, isLoading: isLoadingMembers } =
    useFetchWorkspaceMembers();

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredMembers = workspaceMembers.filter((member) => {
    if (!member.memberEmail) {
      return; // Skip this member if it's null or undefined
    }

    let memberName = "";
    if (member.memberName) {
      memberName = member.memberName.toLowerCase();
    }

    const memberEmail = member.memberEmail.toLowerCase();
    const query = searchQuery.toLowerCase();
    return memberName.includes(query) || memberEmail.includes(query);
  });

  // users in the system
  // const [users, setUsers] = useState([]);
  const userArray: { label: string; value: string }[] = [];

  const [selectedUser, setSelectedUser] = useState<{
    label: string;
    value: string;
  } | null>(null);

  // queries and mutation calls
  const { handleSubmit } = useForm();

  const addMember = api.workspace.addWorkspaceMember.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Member added" />);
      router.reload();
    },
  });
  const { users } = useFetchUsers();

  if (users && workspaceMembers) {
    const workspaceMemberIds = workspaceMembers.map(
      (member) => member.memberId
    );

    users.forEach((user) => {
      const email = user.userEmail || "";
      const userId = user.userId;
      const isMember = workspaceMemberIds.includes(userId);

      // Check if the user is not a member of the workspace
      if (!isMember) {
        userArray.push({ label: email, value: userId });
      }
    });
  }

  console.log(filteredMembers);

  const onSubmit = async () => {
    if (selectedUser) {
      const memberId = selectedUser.value;
      try {
        await addMember.mutateAsync({
          workspaceId: workspaceId,
          userId: memberId,
        });
        // Handle success
      } catch (error) {
        // Handle error
        console.error("Error adding member to workspace:", error);
      }
    }
  };

  const updateRole = api.workspace.updateRole.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Role updated" />);
    },
  });
  const handleRoleChange = (memberId: string, newRole: string) => {
    updateRole
      .mutateAsync({
        workspaceId: workspaceId,
        userId: memberId,
        role: newRole,
      })
      .then(() => {
        console.log("workspace updated");
      })
      .catch((error) => {
        console.error("Failed to update role:", error);
      });
  };

  const deleteMember = api.workspace.deleteWorkspaceMember.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Member deleted" />);
    },
  });

  const handleDeleteMember = (memberId: string) => {
    deleteMember
      .mutateAsync({
        workspaceId: workspaceId,
        userId: memberId,
      })
      .then(() => {
        router.reload();
      })
      .catch((error) => {
        console.error("Failed to delete member:", error);
      });
  };

  return (
    <>
      <Modal
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
      </Modal>

      <main className="min-h-screen w-full">
        <Header name={name || ""} imgUrl={imgUrl} />
        <div className="p-5">
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

              <button
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
                    key={member.memberId}
                    className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600"
                  >
                    <td className="flex items-center whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {member.memberAvatarUrl ? (
                        <Image
                          src={member.memberAvatarUrl || ""}
                          alt="Jese image"
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full">
                          <AvatarPlaceholder name={member.memberEmail || ""} />
                        </div>
                      )}
                      <div className="pl-3">
                        <div className="text-base font-semibold">
                          {member.memberName}
                        </div>
                        <div className="font-normal text-gray-500">
                          {member.memberEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <EditableDropDown
                        initialValue={member.memberRole || "Researcher"}
                        onValueChange={(newRole) =>
                          handleRoleChange(member.memberId, newRole)
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      {member.memberId != user.id && (
                        <a
                          href="#"
                          type="button"
                          data-modal-show="removeModal"
                          className="font-medium text-purple-600 hover:underline dark:text-purple-500"
                          onClick={() => handleDeleteMember(member.memberId)}
                        >
                          Remove user
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
