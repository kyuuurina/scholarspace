import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FiUserPlus } from "react-icons/fi";

// local components
import Layout from "~/components/layout/Layout";
import Header from "~/components/workspace/Header";
import MemberModal from "~/components/members/MemberModal";
import MemberTable from "~/components/members/MemberTable";
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// utils
import { api } from "~/utils/api";
import { useFetchWorkspace, useFetchWorkspaceMembers } from "~/utils/workspace";
import { useRouterId } from "~/utils/routerId";

const Members: NextPageWithLayout = () => {
  const router = useRouter();
  const workspaceId = useRouterId();
  const { name, imgUrl, is_personal, ownerid } = useFetchWorkspace();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // members in the workspace
  const { workspaceMembers } = useFetchWorkspaceMembers();

  // search bar functions
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

  // add member
  const addMember = api.workspace.addWorkspaceMember.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Member added" />);
      router.reload();
    },
  });

  const onSubmit = async (data: { email: string, role: string }) => {
    try {
      await addMember.mutateAsync({
        workspaceId: workspaceId,
        email: data.email,
        role: data.role,
      });
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  // add member error message from server
  let addMemberErrorMsg = addMember.error?.message;
  useEffect(() => {
    addMemberErrorMsg = addMember.error?.message;
  }, [addMember.error]);

  // update member role
  const updateRole = api.workspace.updateRole.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Role updated" />);
    },
    onError: (error) => {
      toast.custom(() => <ErrorToast message={error.message} />);
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
        router.reload();
      })
      .catch((error) => {
        console.error("Failed to update role:", error);
      });
  };

  // delete member
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

  // get workspace role
  const workspaceRole = api.workspace.getWorkspaceRole.useQuery({
    workspaceId: workspaceId,
  });

  return (
    <>
      {/* add member modal */}
      <MemberModal
        openModal={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onSubmit={onSubmit}
        addMemberError={addMemberErrorMsg}
      />

      <main className="min-h-screen w-full">
        <Header name={name || ""} imgUrl={imgUrl} />
        <div className="p-5">
          <div className="relative overflow-x-auto rounded-lg shadow-md">
            {/* search and add member section  */}
            <div className="flex items-center bg-white px-4 py-4">
              <label className="sr-only">Search</label>
              <div className="relative mr-4">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-500"
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
                  className="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 "
                  placeholder="Search for users"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              {workspaceRole.data === "Researcher Admin" && (
                <button
                  onClick={() => {
                    setModalIsOpen(true);
                  }}
                  className="flex items-center justify-between rounded-lg bg-purple-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-800 "
                >
                  <FiUserPlus className="mr-2" />
                  Add Member
                </button>
              )}
            </div>

            {/* member table  */}
            <MemberTable
              filteredMembers={filteredMembers}
              handleRoleChange={handleRoleChange}
              handleDeleteMember={handleDeleteMember}
              userWorkspaceRole={workspaceRole.data}
              isPersonal={is_personal}
              ownerId={ownerid}
            />
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
