// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// utils
import { api } from "~/utils/api";
import { useRouterId } from "~/utils/routerId";
import Link from "next/link";
import { TRPCClientError } from "@trpc/client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiUserPlus, FiSearch } from "react-icons/fi";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { MoonLoader } from "react-spinners";

// components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import Header from "~/components/workspace/Header";
import ProjectMemberTable from "~/components/members/ProjectMemberTable";
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";
const MemberModal = dynamic(() => import("~/components/members/MemberModal"), {
  loading: () => null,
  ssr: false,
});

const ProjectMember: NextPageWithLayout = () => {
  const router = useRouter();
  const id = useRouterId();

  // fetch project
  const { data: project, refetch } = api.project.get.useQuery({
    project_id: id,
  });

  // fetch project members
  const { data: projectMembers, isLoading } =
    api.project.listProjectMembers.useQuery({
      id,
    });

  // fetch project role of authenticated user
  const { data: project_role } = api.project.getProjectUserRole.useQuery({
    project_id: id,
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);

  // add member
  const addMember = api.project.addMember.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Member added" />);
      router.reload();
      setModalIsOpen(false);
    },
  });

  const onSubmit = async (data: { email: string; role: string }) => {
    try {
      await addMember.mutateAsync({
        project_id: id,
        email: data.email,
        project_role: data.role,
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

  // search bar functions
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredMembers = projectMembers?.filter((member) => {
    // filter according to name and email
    return (
      member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // useEffect filtered members when refetch is called and workspaceMembers is updated
  useEffect(() => {
    if (projectMembers) {
      filteredMembers;
    }
  }, [projectMembers]);

  // update member role
  const updateRole = api.project.updateMemberRole.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Member role updated" />);
      router.reload();
    },
  });

  const handleRoleChange = (memberId: string, newRole: string) => {
    updateRole
      .mutateAsync({
        project_id: id,
        user_id: memberId,
        project_role: newRole,
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
  const deleteMember = api.project.deleteMember.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Member removed" />);
    },
  });

  const handleDeleteMember = (memberId: string) => {
    deleteMember
      .mutateAsync({
        project_id: id,
        user_id: memberId,
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

  if (isLoading || !projectMembers) {
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
      <Head title={project?.name} />
      <MemberModal
        openModal={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onSubmit={onSubmit}
        addMemberError={addMemberErrorMsg}
      />
      <main className="flex flex-col">
        {/* Project header */}
        <Header
          name={project?.name}
          imgUrl={project?.cover_img}
          purpose="project"
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
              {project_role?.project_role === "Researcher Admin" && (
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
            <ProjectMemberTable
              filteredMembers={filteredMembers}
              handleRoleChange={handleRoleChange}
              handleDeleteMember={handleDeleteMember}
              userWorkspaceRole={project_role?.project_role}
              isPersonal={false}
              ownerId={null}
              externalCollab={true}
            />
          </div>
        </div>
      </main>
    </>
  );
};

ProjectMember.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default ProjectMember;
