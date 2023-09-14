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
import WorkspaceTabs from "~/components/workspace/WorkspaceTabs";
import PrimaryButton from "~/components/button/PrimaryButton";
import ProjectCard from "~/components/project/ProjectCard";
import ScoreChart from "~/components/chart/ScoreChart";

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
      <main className="flex-col p-10">
        <div className="grid grid-cols-12 gap-x-10">
          {/* Left section of workspace dashboard */}
          <div className="col-span-8 grid gap-y-5">
            <div className="flex items-center space-x-5">
              {/* Workspace header */}
              <div className="relative h-12 w-12">
                {cover_img ? (
                  <Image
                    src={imgUrl}
                    fill
                    style={{ objectFit: "contain" }}
                    alt=""
                  />
                ) : (
                  <AvatarPlaceholder name={name || "SS"} shape="square" />
                )}
              </div>
              <h1 className="line-clamp-3 text-4xl font-bold">{name}</h1>
            </div>
            {/* Navigation Section */}
            <div className="flex items-center justify-between">
              <WorkspaceTabs />
              <div className="flex-shrink-0">
                <PrimaryButton name="Add Project" />
              </div>
            </div>
            {/* Projects Section */}
            <div className="grid gap-5">
              <h5 className="text-xl font-medium text-gray-900 ">Projects</h5>

              <ProjectCard />
              <ProjectCard />
              <ProjectCard />
            </div>
          </div>
          {/* Right section of workspace dashboard */}
          <div className="col-span-4 grid">
            <div>
              <h6 className="text-lg font-bold">About</h6>
              <p className="line-clamp-5 text-sm text-gray-900">
                {description}
              </p>
            </div>
            <div>
              <hr className="bg-gray-200" />
              <h6 className="text-lg font-bold">Members</h6>
              <div className="flex flex-row gap-2">
                <p> Test </p>
              </div>
            </div>
            <hr className=" bg-gray-200" />
            <div>
              <h6 className="mb-5 text-lg font-bold">Collaborativity Score</h6>
              <ScoreChart score={90} />
            </div>
            <hr className=" bg-gray-200 " />
            <div>
              <h6 className="mb-5 text-lg font-bold">Productivity Score</h6>
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
