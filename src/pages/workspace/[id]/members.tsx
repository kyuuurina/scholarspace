import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FiUserPlus, FiSearch } from "react-icons/fi";
import dynamic from "next/dynamic";

// local components
import Head from "~/components/layout/Head";
import Layout from "~/components/layout/Layout";
import Header from "~/components/workspace/Header";
import MemberTable from "~/components/members/MemberTable";
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";
import { MoonLoader } from "react-spinners";

const MemberModal = dynamic(() => import("~/components/members/MemberModal"), {
  loading: () => null,
  ssr: false,
});

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// utils
import { api } from "~/utils/api";
import { useRouterId } from "~/utils/routerId";
import Link from "next/link";
import { TRPCClientError } from "@trpc/client";

const Members: NextPageWithLayout = () => {
  const router = useRouter();
  const workspaceId = useRouterId();

  const { data: workspace, refetch } = api.workspace.get.useQuery({
    id: workspaceId,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { data: workspaceMembers, isLoading } =
    api.workspace.listWorkspaceMembers.useQuery({
      id: workspaceId,
    });

  // search bar functions
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredMembers = workspaceMembers?.filter((member) => {
    // filter according to name and email
    return (
      member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // useEffect filtered members when refetch is called and workspaceMembers is updated
  useEffect(() => {
    if (workspaceMembers) {
      filteredMembers;
    }
  }, [workspaceMembers]);

  // add member
  const addMember = api.workspace.addWorkspaceMember.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Member added" />);
      router.reload();
      setModalIsOpen(false);
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
      toast.custom(() => {
        if (error instanceof TRPCClientError) {
          return <ErrorToast message={error.message} />;
        } else {
          // Handle other types of errors or fallback to a default message
          return <ErrorToast message="An error occurred." />;
        }
      });
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
  });
  const handleRoleChange = (memberId: string, newRole: string) => {
    updateRole
      .mutateAsync({
        workspaceId: workspaceId,
        userId: memberId,
        role: newRole,
      })
      .then(async () => {
        await refetch();
      })
      .catch((error) => {
        toast.custom(() => {
          if (error instanceof TRPCClientError) {
            return <ErrorToast message={error.message} />;
          } else {
            // Handle other types of errors or fallback to a default message
            return <ErrorToast message="An error occurred." />;
          }
        });
        router.reload();
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
        toast.custom(() => {
          if (error instanceof TRPCClientError) {
            return <ErrorToast message={error.message} />;
          } else {
            // Handle other types of errors or fallback to a default message
            return <ErrorToast message="An error occurred." />;
          }
        });
      });
  };

  // get workspace role
  const workspaceRole = api.workspace.getWorkspaceRole.useQuery({
    workspaceId: workspaceId,
  });

  if (isLoading || !workspaceMembers) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <MoonLoader color="#7C3AED" />
      </div>
    );
  }
  if (!workspace) {
    return (
      <>
        <main className="flex min-h-screen w-full flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Workspace not found</h1>
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
              filteredMembers={filteredMembers}
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
