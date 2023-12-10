// utils
import { useRouterId } from "~/utils/routerId";
import { useFetchProject } from "~/utils/project";

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
import AvatarPlaceholder from "~/components/avatar/AvatarPlaceholder";
import ScoreChart from "~/components/chart/ScoreChart";
import LoadingSpinner from "~/components/LoadingSpinner";

const Project: NextPageWithLayout = () => {
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
        {/* Project header */}
        <Header name={name || ""} imgUrl={imgUrl} purpose="project" />

        <div className="grid p-5 md:grid-cols-12 md:gap-x-5">
          {/* Left section of workspace dashboard */}
          <div className="w-full md:col-span-8">
            <section className="bg-white dark:bg-gray-900">
              <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-6 lg:py-16">
                <dl className="mx-auto grid max-w-screen-md gap-8 text-gray-900 sm:grid-cols-3">
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold text-green-500 md:text-4xl">
                      73
                    </dt>
                    <dd className="font-medium text-green-500 ">
                      tasks completed
                    </dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold text-red-500 md:text-4xl">
                      20
                    </dt>
                    <dd className="font-medium text-red-500 ">
                      unfinshed tasks
                    </dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold text-blue-500 md:text-4xl">
                      5
                    </dt>
                    <dd className="font-medium text-blue-500 ">closed tasks</dd>
                  </div>
                </dl>
              </div>
            </section>
            <div className="my-2 overflow-x-auto bg-white">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="border-grey-50 border text-xs uppercase text-gray-700 ">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all"
                          type="checkbox"
                          className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                        />
                        <label htmlFor="checkbox-all" className="sr-only">
                          checkbox
                        </label>
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Assigned To
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Deadline
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                    <td className="w-4 px-4 py-3">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                        />
                        <label
                          htmlFor="checkbox-table-search-1"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="flex items-center whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
                    >
                      Task 1
                    </th>
                    <td className="px-4 py-2">
                      <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2 py-0.5 text-xs font-medium">
                        Khairina
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <div className="mr-2 inline-block h-4 w-4 rounded-full bg-red-300"></div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                      22, Sept 23
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                    <td className="w-4 px-4 py-3">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                        />
                        <label
                          htmlFor="checkbox-table-search-1"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="flex items-center whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
                    >
                      Task 2
                    </th>
                    <td className="px-4 py-2">
                      <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2 py-0.5 text-xs font-medium">
                        Khairina
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <div className="mr-2 inline-block h-4 w-4 rounded-full bg-green-400"></div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                      22, Sept 23
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                    <td className="w-4 px-4 py-3">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                        />
                        <label
                          htmlFor="checkbox-table-search-1"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="flex items-center whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
                    >
                      Task 3
                    </th>
                    <td className="px-4 py-2">
                      <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2 py-0.5 text-xs font-medium">
                        Khairina
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <div className="mr-2 inline-block h-4 w-4 rounded-full bg-orange-500"></div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                      22, Sept 23
                    </td>
                  </tr>
                </tbody>
              </table>
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
                {users?.slice(0, 5).map((user) =>
                  user?.avatar_url ? (
                    <Image
                      key={user.avatar_url}
                      src={user.avatar_url}
                      alt="Workspace member avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div key={user?.avatar_url} className="w-10 rounded-full">
                      <AvatarPlaceholder name={user?.email || "SS"} />
                    </div>
                  )
                )}
                {users && users.length > 5 && (
                  <Link
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-xs font-medium text-white"
                    href={`/project/${id}/members`}
                  >
                    <span>{users?.length - 5}+</span>
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

Project.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default Project;
