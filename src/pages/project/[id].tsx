// // utils
// import { useRouterId } from "~/utils/routerId";
// import { useFetchProject } from "~/utils/project";
// import { api } from "~/utils/api";

// // types
// import type { ReactElement } from "react";
// import type { NextPageWithLayout } from "~/pages/_app";

// // components
// import Layout from "~/components/layout/Layout";
// import Head from "~/components/layout/Head";
// import Header from "~/components/workspace/Header";
// import Card from "~/components/Card";
// import MembersCard from "~/components/members/MembersCard";
// import ScoreChart from "~/components/chart/ScoreChart";
// import PageLoader from "~/components/layout/PageLoader";
// import GanttChart from "~/components/project/GanttChart";
// import React from "react";
// import { useFetchProjectSummary } from "~/utils/project";

// const Project: NextPageWithLayout = () => {
//   const id = useRouterId();
//   const {
//     name,
//     description,
//     isLoading,
//     error,
//     imgUrl,
//     c_score,
//     p_score,
//     users,
//   } = useFetchProject();

//   const { projectSummary, refetch } = useFetchProjectSummary(id);

//   return (
//     <>
//       <Head title={name} />
//       <PageLoader isLoading={isLoading} errorMsg={error?.message}>
//         <main className="flex flex-col">
//           {/* Project header */}
//           <Header name={name || ""} imgUrl={imgUrl} purpose="project" />
//           <div className="grid p-5 md:grid-cols-12 md:gap-x-5">
//             {/* Left section of workspace dashboard */}
//             <div className="w-full md:col-span-8">
//               <GanttChart projectSummary={projectSummary} refetch={refetch} />
//             </div>
//             {/* Right section of workspace dashboard */}
//             <div className="grid w-full gap-y-2 py-5 md:col-span-4 md:py-1">
//               <Card title={"About"}>
//                 <p className="line-clamp-5 text-sm text-gray-900">
//                   {description}
//                 </p>
//               </Card>
//               <MembersCard id={id} name={"project"} users={users} />
//               <Card title={"Collaborative Score"} center>
//                 <ScoreChart name={"Collaborative"} score={c_score || 0} />
//               </Card>
//               <Card title={"Productivity Score"} center>
//                 <ScoreChart name={"Productivity"} score={p_score || 0} />
//               </Card>
//             </div>
//           </div>
//         </main>
//       </PageLoader>
//     </>
//   );
// };

// Project.getLayout = function getLayout(page: ReactElement) {
//   return (
//     <>
//       <Layout>{page}</Layout>
//     </>
//   );
// };

// export default Project;
