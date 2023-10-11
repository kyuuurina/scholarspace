// utils
// import { useFetchWorkspace, useFetchWorkspaceMembers } from "~/utils/workspace";
import { useRouterId } from "~/utils/routerId";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// pages
import ErrorPage from "~/pages/error-page";

// local components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import LoadingSpinner from "~/components/LoadingSpinner";
import PrimaryButton from "~/components/button/PrimaryButton";
import ProjectCard from "~/components/project/ProjectCard";
import ScoreChart from "~/components/chart/ScoreChart";
import Card from "~/components/Card";
import Header from "~/components/workspace/Header";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";

import Image from "next/image";
import Link from "next/link";

const Workspace: NextPageWithLayout = () => {
  const { name, description, isLoading, error, imgUrl } = useFetchWorkspace();
  const { workspaceMembers } = useFetchWorkspaceMembers();
  const workspaceId = useRouterId();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  return (
    <>
      <Head title={name} />
      <main className="flex flex-col">
        {/* Workspace header */}
        <Header name={name || ""} imgUrl={imgUrl} />
        <div className="grid p-5 md:grid-cols-12 md:gap-x-5">
          {/* Left section of workspace dashboard */}
          {/* Projects Section */}
          <div className="w-full md:col-span-8">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-xl font-medium text-gray-900 ">Projects</h5>
              <PrimaryButton name="Add Project" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <ProjectCard />
              <ProjectCard />
              <ProjectCard />
              <ProjectCard />
              <ProjectCard />
              <ProjectCard />
            </div>
          </div>
          {/* Right section of workspace dashboard */}
          <div className="grid w-full gap-y-2 py-5 md:col-span-4 md:py-1">
            <Card title={"About"}>
              <p className="line-clamp-5 text-sm text-gray-900">
                {description}
              </p>
            </Card>
            <Card title={"Members"}>
              <div className="flex flex-row gap-2">
                {workspaceMembers?.slice(0, 5).map((member) =>
                  member.memberAvatarUrl ? (
                    <Image
                      key={member.memberId}
                      src={member.memberAvatarUrl}
                      alt="Workspace member avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div key={member.memberId} className="w-10 rounded-full">
                      <AvatarPlaceholder name={member.memberEmail || "SS"} />
                    </div>
                  )
                )}
                {workspaceMembers.length > 5 && (
                  <Link
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-xs font-medium text-white"
                    href={`/workspace/${workspaceId}/members`}
                  >
                    <span>{workspaceMembers.length - 5}+</span>
                  </Link>
                )}
              </div>
            </Card>
            <Card title={"Collaborativity Score"} center>
              <ScoreChart score={90} />
            </Card>
            <Card title={"Productivity Score"} center>
              <ScoreChart score={70} />
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

Workspace.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default Workspace;
