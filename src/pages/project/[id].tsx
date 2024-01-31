// utils
import { useRouterId } from "~/utils/routerId";
import { api } from "~/utils/api";
import { useFetchProjectSummary } from "~/utils/project";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// libraries
import React from "react";
import { MoonLoader } from "react-spinners";
import Link from "next/link";

// components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import Header from "~/components/workspace/Header";
import Card from "~/components/Card";
import MembersCard from "~/components/members/MembersCard";
import ScoreChart from "~/components/chart/ScoreChart";
import GanttChart from "~/components/project/GanttChart";

const Project: NextPageWithLayout = () => {
  const id = useRouterId();
  const { projectSummary, refetch } = useFetchProjectSummary(id);
  const { data: project, isLoading } = api.project.get.useQuery({
    project_id: id,
  });

  // extract the users array from workspace object
  const usersArray =
    project?.project_users.map((projectUser) => ({
      id: projectUser.user.id,
      email: projectUser.user.email,
      name: projectUser.user.name,
      has_avatar: projectUser.user.has_avatar,
    })) || [];

  if (isLoading) {
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
          <h1 className="text-4xl font-bold">Project not found</h1>
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
      <main className="flex flex-col">
        {/* Project header */}
        <Header
          name={project?.name}
          imgUrl={project?.cover_img}
          purpose="project"
        />
        <div className="grid p-5 md:grid-cols-12 md:gap-x-5">
          {/* Left section of workspace dashboard */}
          <div className="w-full md:col-span-8">
            <GanttChart projectSummary={projectSummary} refetch={refetch} />
          </div>
          {/* Right section of workspace dashboard */}
          <div className="grid w-full gap-y-2 py-5 md:col-span-4 md:py-1">
            <Card title={"About"}>
              <p className="line-clamp-5 text-sm text-gray-900">
                {project?.description}
              </p>
            </Card>
            <MembersCard id={id} name={"project"} users={usersArray} />
            <Card title={"Collaborative Score"} center>
              <ScoreChart name={"Collaborative"} score={project?.c_score} />
            </Card>
            <Card title={"Productivity Score"} center>
              <ScoreChart name={"Productivity"} score={project?.p_score} />
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

Project.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default Project;
