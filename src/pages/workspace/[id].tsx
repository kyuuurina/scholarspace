// utils
import { useFetchWorkspace } from "~/utils/workspace";

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

const Workspace: NextPageWithLayout = () => {
  const { name, description, isLoading, error, imgUrl } = useFetchWorkspace();

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
                <p> Test </p>
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
