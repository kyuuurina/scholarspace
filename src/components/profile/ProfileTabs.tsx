//Tabs of Profile Details & My Posts

import Link from "next/link";
import { useRouter } from "next/router";

const ProfileTabs: React.FC = () => {
  const router = useRouter();

  // Check if router.query and router.query.id are defined before accessing their values
  const profile_id =
    router.query && router.query.id ? router.query.id.toString() : "";

    return (
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul
          className="flex flex-wrap text-center text-sm font-medium"
          id="myTab"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          <li className="mr-2" role="presentation">
            {/* <Link href={`/manage-profile/${profile_id}`}> */}
            <Link href={`/manage-profile`}>
              <span
                className={`inline-block rounded-t-lg border-b-2 p-4 ${
                  router.asPath === `/manage-profile`
                    ? "border-purple-500 text-purple-500"
                    // ? "bg-purple-accent-2 text-white"
                    : "border-transparent text-gray-600 dark:text-gray-300 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
                id="dashboard-tab"
                role="tab"
                aria-controls="dashboard"
                aria-selected={router.asPath === `/manage-profile`}
              >
                My Profile
              </span>
            </Link>
          </li>
          <li role="presentation">
            <Link href={`/manage-profile/${profile_id}/mypost`}>
              <span
                className={`inline-block rounded-t-lg border-b-2 p-4 ${
                  router.asPath === `/manage-profile/${profile_id}/mypost`
                    ? "border-purple-500 text-purple-500"
                    // ? "bg-purple-accent-2 text-white"
                    : "border-transparent text-gray-600 dark:text-gray-300 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
                id="contacts-tab"
                role="tab"
                aria-controls="contacts"
                aria-selected={
                  router.asPath === `/manage-profile/${profile_id}/mypost`
                }
              >
                My Post
              </span>
            </Link>
          </li>
          <li role="presentation">
            <Link href={`/manage-profile/${profile_id}/likedpost`}>
              <span
                className={`inline-block rounded-t-lg border-b-2 p-4 ${
                  router.asPath === `/manage-profile/${profile_id}/likedpost`
                    ? "border-purple-500 text-purple-500"
                    // ? "bg-purple-accent-2 text-white"
                    : "border-transparent text-gray-600 dark:text-gray-300 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
                id="contacts-tab"
                role="tab"
                aria-controls="contacts"
                aria-selected={
                  router.asPath === `/manage-profile/${profile_id}/likedpost`
                }
              >
                My Post
              </span>
            </Link>
          </li>
        </ul>
      </div>
    );
  };
  
  export default ProfileTabs;

//   return (
//     <div className="border-b border-gray-200 dark:border-gray-700">
//       <ul
//         className="flex flex-wrap text-center text-sm font-medium"
//         id="myTab"
//         data-tabs-toggle="#myTabContent"
//         role="tablist"
//       >
//         <li className="mr-2" role="presentation">
//           <Link href={`/manage-profile/${profile_id}`}>
//             <span
//               className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 ${
//                 router.asPath === `/manage-profile/${profile_id}`
//                   ? "border-blue-500 text-blue-500"
//                   : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
//               }`}
//               id="dashboard-tab"
//               role="tab"
//               aria-controls="dashboard"
//               aria-selected={router.asPath === `/manage-profile/${profile_id}`}
//             >
//               My Profile
//             </span>
//           </Link>
//         </li>
//         <li role="presentation">
//           <Link href={`/manage-profile/${profile_id}/mypost`}>
//             <span
//               className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 ${
//                 router.asPath === `/manage-profile/${profile_id}/mypost`
//                   ? "border-blue-500 text-blue-500"
//                   : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
//               }`}
//               id="contacts-tab"
//               role="tab"
//               aria-controls="contacts"
//               aria-selected={
//                 router.asPath === `/manage-profile/${profile_id}/mypost`
//               }
//             >
//               My Post
//             </span>
//           </Link>
//         </li>
//         {/* <li className="mr-2" role="presentation">
//           <Link href={`/workspace/${workspaceId}/settings`}>
//             <span
//               className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 ${
//                 router.asPath === `/workspace/${workspaceId}/settings`
//                   ? "border-blue-500 text-blue-500"
//                   : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
//               }`}
//               id="settings-tab"
//               role="tab"
//               aria-controls="settings"
//               aria-selected={
//                 router.asPath === `/workspace/${workspaceId}/settings`
//               }
//             >
//               Settings
//             </span>
//           </Link>
//         </li> */}
//       </ul>
//     </div>
//   );
// };

// export default ProfileTabs;
