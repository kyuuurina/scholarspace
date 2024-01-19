import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FiUserPlus, FiSearch } from "react-icons/fi";

// local components
import Head from "~/components/layout/Head";
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
import { useRouterId } from "~/utils/routerId";

const Members: NextPageWithLayout = () => {
  const router = useRouter();
  const workspaceId = useRouterId();

  const { data: workspace } = api.workspace.get.useQuery({ id: workspaceId });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    data: workspaceMembers,
    isLoading,
    error,
  } = api.workspace.listWorkspaceMembers.useQuery({
    id: workspaceId,
  });
  console.log("workspaceMembers", workspaceMembers);

  // search bar functions
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredMembers = workspaceMembers?.filter((member) => {
    if (
      !member.user.email ||
      !member.user.profile ||
      !member.user.profile.name
    ) {
      return false; // Return false to exclude this member from the filtered list
    }

    const memberName = member.user.profile.name.toLowerCase();
    const memberEmail = member.user.email.toLowerCase();
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

  const onSubmit = async (data: { email: string; role: string }) => {
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

  if (!workspaceMembers || isLoading || !workspace) {
    return <div>Loading...</div>;
  }

  console.log("filteredMembers", filteredMembers);

  return (
    <>
      {/* add member modal */}
      <Head title={workspace?.name} />
      <MemberModal
        openModal={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onSubmit={onSubmit}
        addMemberError={addMemberErrorMsg}
      />

      <main className="min-h-screen w-full">
        <Header
          name={workspace?.name}
          imgUrl={workspace?.cover_img}
          purpose="workspace"
        />
        <div className="p-5">
          <div className="relative overflow-x-auto rounded-lg shadow-md">
            {/* search and add member section  */}
            <div className="flex items-center bg-white px-4 py-4">
              <label className="sr-only">Search</label>
              <div className="relative mr-4">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiSearch />
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
              filteredMembers={workspaceMembers}
              handleRoleChange={handleRoleChange}
              handleDeleteMember={handleDeleteMember}
              userWorkspaceRole={workspaceRole.data}
              isPersonal={workspace?.is_personal}
              ownerId={workspace?.ownerid}
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
