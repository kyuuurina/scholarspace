//All tab should display /home-rwp page
//Following tab should display /home-rwp/following page

import Link from "next/link";
import { useRouter } from "next/router";

const AllFollowingTabs: React.FC = () => {
  const router = useRouter();

  // Check if router.query and router.query.id are defined before accessing their values
  const post_id =
    router.query && router.query.id ? router.query.id.toString() : "";

    return (
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul
          className="flex justify-center flex-wrap text-center text-sm font-medium"
          id="myTab"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          <li className="mr-2" role="presentation">
            <Link href={`/home-rwp/${post_id}`}>
              <span
                className={`inline-block rounded-t-lg border-b-2 p-4 ${
                  router.asPath === `/home-rwp/${post_id}`
                    ? "border-purple-800 underline text-purple-800"
                    : "border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
                id="dashboard-tab"
                role="tab"
                aria-controls="dashboard"
                aria-selected={router.asPath === `/home-rwp/${post_id}`}
              >
                All
              </span>
            </Link>
          </li>
    
          <li role="presentation">
            <Link href={`/home-rwp/${post_id}/following-post`}>
              <span
                className={`inline-block rounded-t-lg border-b-2 p-4 ${
                  router.asPath === `/home-rwp/${post_id}/following-post`
                    ? "border-purple-800 underline text-purple-800"
                    : "border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
                id="contacts-tab"
                role="tab"
                aria-controls="contacts"
                aria-selected={
                  router.asPath === `/home-rwp/${post_id}/following-post`
                }
              >
                Following
              </span>
            </Link>
          </li>
        </ul>
      </div>
    );
};

export default AllFollowingTabs;


// import Link from "next/link";
// import { useRouter } from "next/router";
// import React, { useState } from "react";

// const AllFollowingTabs: React.FC = () => {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<string>("all");

//   const handleTabClick = async (tab: string, path: string) => {
//     setActiveTab(tab);
//     try {
//       await router.push(path); // Navigate to the selected tab's path
//     } catch (error) {
//       // Handle any potential errors here
//       console.error("Navigation error:", error);
//     }
//   };

//   return (
//     <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
//       <ul className="flex flex-wrap -mb-px">
//         {/* "All tab" */}
//         <li className="mr-2 flex-1">
//           <a
//             className={`inline-block p-4 rounded-t-lg hover:text-gray-600 dark:hover:text-gray-300 ${
//               activeTab === "all" ? "text-purple-600 border-b-2 border-purple-600" : "border-transparent"
//             }`}
//             onClick={() => handleTabClick("all", "/home-rwp")}
//           >
//             All
//           </a>
//         </li>

//         {/* "Following tab" */}
//         <li className="mr-2 flex-1">
//           <a
//             className={`inline-block p-4 rounded-t-lg hover:text-gray-600 dark:hover:text-gray-300 ${
//               activeTab === "following" ? "text-purple-600 border-b-2 border-purple-600" : "border-transparent"
//             }`}
//             onClick={() => handleTabClick("following", "/home-rwp/following-post")}
//           >
//             Following
//           </a>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default AllFollowingTabs;








// //Another ref HTML Static styling Tabs - ref: https://flowbite.com/docs/components/tabs/
