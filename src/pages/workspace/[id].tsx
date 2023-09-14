import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useUser } from "@supabase/auth-helpers-react";

// local components
import Layout from "~/components/layout/Layout";
import { Head } from "~/components/layout/Head";
import { AvatarPlaceholder } from "~/components/AvatarPlaceholder";
import { WorkspaceTabs } from "~/components/workspace/WorkspaceTabs";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { ProjectCard } from "~/components/project/ProjectCard";
import { ScoreChart } from "~/components/chart/ScoreChart";
import ErrorPage from "~/components/ErrorPage";
import Loading from "../loading";

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

  const workspaceData = workspace.data;

  console.log(workspaceData);

  let imgUrl = "";

  if (workspace.isLoading) {
    return <Loading />;
  }

  if (router.isFallback) {
    // Return the loading component while the page is still loading
    return <Loading />;
  }

  if (workspace.error) {
    // Handle errors from the server here
    return <ErrorPage error={workspace.error.message} />;
  }

  if (workspaceData?.cover_img) {
    imgUrl = user?.id
      ? `https://eeikbrtyntwckpyfphlm.supabase.co/storage/v1/object/public/workspace-covers/${user.id}/${workspaceData.cover_img}`
      : "";
  }

  return (
    <>
      <Head title={workspaceData?.name} />
      <main className="flex-col p-10">
        <div className="grid grid-cols-12 gap-x-10">
          <div className="col-span-8 grid gap-y-5">
            <div className="flex items-center space-x-5">
              <div className="relative h-12 w-12">
                {workspaceData?.cover_img ? (
                  <Image
                    src={imgUrl}
                    fill
                    style={{ objectFit: "contain" }}
                    alt=""
                  />
                ) : (
                  <AvatarPlaceholder
                    name={workspaceData?.name || "SS"}
                    shape="square"
                  />
                )}
              </div>
              <h1 className="line-clamp-3 text-4xl font-bold">
                {workspaceData?.name}
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <WorkspaceTabs />
              <div className="flex-shrink-0">
                <PrimaryButton name="Add Project" />
              </div>
            </div>
            <div className="grid gap-5">
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                Projects
              </h5>

              <ProjectCard />
              <ProjectCard />
              <ProjectCard />
            </div>
          </div>
          <div className="col-span-4 grid gap-0.5">
            <div>
              <h6 className="text-lg font-bold dark:text-white">About</h6>
              <p className="line-clamp-5 text-sm text-gray-900 dark:text-white">
                {workspaceData?.description}
              </p>
            </div>
            <div>
              <hr className="h-px bg-gray-200 dark:bg-gray-700" />
              <h6 className="text-lg font-bold dark:text-white">Members</h6>
              <div className="flex flex-row gap-2">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://i.pravatar.cc/300"
                  alt="Rounded avatar"
                />
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://i.pravatar.cc/300"
                  alt="Rounded avatar"
                />
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://i.pravatar.cc/300"
                  alt="Rounded avatar"
                />
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://i.pravatar.cc/300"
                  alt="Rounded avatar"
                />
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://i.pravatar.cc/300"
                  alt="Rounded avatar"
                />
              </div>
            </div>
            <hr className="h-px bg-gray-200 dark:bg-gray-700" />
            <div>
              <h6 className="mb-5 text-lg font-bold dark:text-white">
                Collaborativity Score
              </h6>
              <ScoreChart score={90} />
            </div>
            <hr className="h-px bg-gray-200 dark:bg-gray-700" />
            <div>
              <h6 className="mb-5 text-lg font-bold dark:text-white">
                Productivity Score
              </h6>
              <ScoreChart score={70} />
            </div>
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
