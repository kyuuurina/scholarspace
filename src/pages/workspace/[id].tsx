import Image from "next/image";

// hooks
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

// utils
import { api } from "~/utils/api";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// pages
import ErrorPage from "~/pages/error-page";

// local components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import LoadingSpinner from "~/components/LoadingSpinner";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";
import PrimaryButton from "~/components/button/PrimaryButton";
import ProjectCard from "~/components/project/ProjectCard";
import ScoreChart from "~/components/chart/ScoreChart";
import HeaderButton from "~/components/workspace/HeaderButton";
import Card from "~/components/Card";

const Workspace: NextPageWithLayout = () => {
  const router = useRouter();
  const user = useUser();

  const workspace = api.workspace.get.useQuery(
    {
      id: router.query.id as string,
    },
    {
      enabled: !!router.query.id,
    }
  );

  const { name, description, cover_img } = workspace.data || {
    name: "Default workspace",
    description: "This is the default workspace.",
  };

  if (workspace.isLoading) {
    return <LoadingSpinner />;
  }

  if (workspace.error) {
    return <ErrorPage error={workspace.error.message} />;
  }

  // store workspace cover image url
  let imgUrl = "";
  if (cover_img) {
    imgUrl = user?.id
      ? `https://eeikbrtyntwckpyfphlm.supabase.co/storage/v1/object/public/workspace-covers/${user.id}/${cover_img}`
      : "";
  }

  return (
    <>
      <Head title={name} />
      <main className="flex flex-col">
        {/* Workspace header */}
        <div className="flex w-full justify-between border-b bg-white px-5 py-2 sm:py-5">
          <div className="flex items-center gap-x-3">
            {cover_img ? (
              <div className="relative h-12 w-12">
                <Image
                  src={imgUrl}
                  fill
                  style={{ objectFit: "contain" }}
                  alt=""
                />
              </div>
            ) : (
              <AvatarPlaceholder name={name || "SS"} shape="square" />
            )}
            <h1 className="truncate text-2xl font-bold sm:text-4xl">{name}</h1>
          </div>
          <div className="flex items-center gap-x-2">
            <HeaderButton type={"members"} />
            <HeaderButton type={"settings"} />
          </div>
        </div>
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
          <div className="grid w-full gap-y-2 py-5 md:py-1 md:col-span-4">
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
