// utils
import { useRouterId } from "~/utils/routerId";
// import { useFetchWorkspaceProjects } from "~/utils/project";
import { useFetchGrantSummary } from "~/utils/grant";

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
import CreateProjectModal from "~/components/project/CreateProjectModal";
import CreateGrantModal from "~/components/grant/create-grant-form";
import PageLoader from "~/components/layout/PageLoader";
import MembersCard from "~/components/members/MembersCard";

const GanttChart = dynamic(() => import("~/components/grant/GanttChart"), {
  loading: () => null,
  ssr: false,
});

const ProjectCard = dynamic(() => import("~/components/project/ProjectCard"), {
  loading: () => null,
  ssr: false,
});

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

  // fetch workspace details
  const {
    data: workspace,
    isLoading,
    error,
  } = api.workspace.get.useQuery({ id: workspaceId });

  if (!workspace) return null;

  console.log(workspace);

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
      <PageLoader isLoading={isLoading} errorMsg={error?.message}>
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
                users={workspace.workspace_user}
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
      </PageLoader>
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
