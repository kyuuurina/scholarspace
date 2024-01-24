// utils
import { useRouterId } from "~/utils/routerId";
import { useFetchGrantSummary } from "~/utils/grant";
import Link from "next/link";
import { MoonLoader } from "react-spinners";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// libraries
import { useState } from "react";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";

// local components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import PrimaryButton from "~/components/button/PrimaryButton";
import ScoreChart from "~/components/chart/ScoreChart";
import Card from "~/components/Card";
import Header from "~/components/workspace/Header";
import MembersCard from "~/components/members/MembersCard";

const GanttChart = dynamic(() => import("~/components/grant/GanttChart"), {
  loading: () => null,
  ssr: false,
});

const ProjectCard = dynamic(() => import("~/components/project/ProjectCard"), {
  loading: () => null,
  ssr: false,
});

const CreateProjectModal = dynamic(
  () => import("~/components/project/CreateProjectModal"),
  {
    loading: () => null,
    ssr: false,
  }
);

const CreateGrantModal = dynamic(
  () => import("~/components/grant/create-grant-form"),
  {
    loading: () => null,
    ssr: false,
  }
);

const Workspace: NextPageWithLayout = () => {
  // const projects = useFetchWorkspaceProjects();
  const workspaceId = useRouterId();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [grantModalIsOpen, setGrantModalIsOpen] = useState(false);

  // get workspace role
  const workspaceRole = api.workspace.getWorkspaceRole.useQuery({
    workspaceId: workspaceId,
  });
  const { grantSummary, refetch } = useFetchGrantSummary(workspaceId);
  console.log(grantSummary);
  // fetch workspace details
  const { data: workspace, isLoading } = api.workspace.get.useQuery({
    id: workspaceId,
  });

  // extract the users array from workspace object
  const usersArray =
    workspace?.workspace_user.map((workspaceUser) => ({
      id: workspaceUser.user.id,
      email: workspaceUser.user.email,
      name: workspaceUser.user.name,
      has_avatar: workspaceUser.user.has_avatar,
    })) || [];

  // fetch projects of workspace
  const { data: projects } = api.project.listWorkspaceProjects.useQuery({
    workspace_id: workspaceId,
  });

  if (isLoading) {
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

  if (!workspace) return null;

  return (
    <>
      <Head title={workspace.name} />
      <CreateProjectModal
        openModal={modalIsOpen}
        onClick={() => setModalIsOpen(false)}
      />
      <CreateGrantModal
        openModal={grantModalIsOpen}
        onClick={() => setGrantModalIsOpen(false)}
        refetch={refetch}
      />
      <main className="flex flex-col">
        {/* Workspace header */}
        <Header
          name={workspace.name}
          imgUrl={workspace.cover_img}
          purpose="workspace"
        />
        <div className="grid p-5 md:grid-cols-12 md:gap-x-5">
          {/* Left section of workspace dashboard */}
          {/* Projects Section */}
          <div className="w-full md:col-span-8">
            {grantSummary !== undefined && (
              <GanttChart grantSummary={grantSummary} refetch={refetch} />
            )}
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-xl font-medium text-gray-900 ">Projects</h5>
              {workspaceRole.data === "Researcher Admin" && (
                <div className="flex">
                  <PrimaryButton
                    name="Add Project"
                    onClick={() => setModalIsOpen(true)}
                  />
                </div>
              )}
            </div>
            <div className="grid max-w-max gap-5 md:grid-cols-2">
              {/* map projects array and pass project object to project card  */}
              {projects?.map((project) => (
                <ProjectCard key={project.project_id} project={project} />
              ))}
            </div>
          </div>
          {/* Right section of workspace dashboard */}
          <div className="grid w-full gap-y-2 py-5 md:col-span-4 md:py-1">
            <Card title={"About"}>
              <p className="line-clamp-5 text-sm text-gray-900">
                {workspace.description}
              </p>
            </Card>
            <MembersCard
              id={workspaceId}
              name={"workspace"}
              users={usersArray}
            />
            <Card title={"Collaborative Score"} center>
              <ScoreChart name="Collaborative" score={90} />
            </Card>
            <Card title={"Productivity Score"} center>
              <ScoreChart name="Productivity" score={70} />
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
