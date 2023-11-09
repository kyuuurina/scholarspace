// utils
import { useRouterId } from "~/utils/routerId";
import { useFetchProject } from "~/utils/project";
import { useState } from "react";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// pages
import ErrorPage from "~/pages/error-page";

// components
import Layout from "~/components/layout/Layout";
import Image from "next/image";
import Link from "next/link";
import Head from "~/components/layout/Head";
import Header from "~/components/workspace/Header";
import Card from "~/components/Card";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";
import ScoreChart from "~/components/chart/ScoreChart";
import LoadingSpinner from "~/components/LoadingSpinner";
import MemberTable from "~/components/members/MemberTable";

const ProjectMember: NextPageWithLayout = () => {
  const {
    name,
    description,
    isLoading,
    error,
    imgUrl,
    c_score,
    p_score,
    users,
  } = useFetchProject();

  const id = useRouterId();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  // search bar functions
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredMembers = users?.filter((user) => {
    if (!user?.email) {
      return; // Skip this member if it's null or undefined
    }

    let memberName = "";
    if (user.name) {
      memberName = user.name.toLowerCase();
    }

    const memberEmail = user.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return memberName.includes(query) || memberEmail.includes(query);
  });

  return (
    <>
      <Head title={name} />
      <main className="flex flex-col">
        {/* Project header */}
        <Header name={name || ""} imgUrl={imgUrl} purpose="project" />
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
              {/* {workspaceRole.data === "Researcher Admin" && (
                <button
                  onClick={() => {
                    setModalIsOpen(true);
                  }}
                  className="flex items-center justify-between rounded-lg bg-purple-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-800 "
                >
                  <FiUserPlus className="mr-2" />
                  Add Member
                </button>
              )} */}
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

ProjectMember.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default ProjectMember;
