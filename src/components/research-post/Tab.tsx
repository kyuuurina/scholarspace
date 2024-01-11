//Tabs of Profile Details & My Posts

import Link from "next/link";
import { useRouter } from "next/router";

const Tabs: React.FC = () => {
  const router = useRouter();

  // Check if router.query and router.query.id are defined before accessing their values
  const user_id =
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
          {/* <Link href={`/${user_id}`}> */}
          <Link href={`/${user_id}`}>
            <span
              className={`inline-block rounded-t-lg border-b-2 p-4 ${
                router.asPath === `/`
                  ? "border-purple-500 text-purple-500"
                  : // ? "bg-purple-accent-2 text-white"
                    "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-300"
              }`}
              id="dashboard-tab"
              role="tab"
              aria-controls="dashboard"
              aria-selected={router.asPath === `/${user_id}`}
            >
              All
            </span>
          </Link>
        </li>
        <li role="presentation">
          <Link href={`/${user_id}/following-post`}>
            <span
              className={`inline-block rounded-t-lg border-b-2 p-4 ${
                router.asPath === `/${user_id}/following-post`
                  ? "border-purple-500 text-purple-500"
                  : // ? "bg-purple-accent-2 text-white"
                    "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-300"
              }`}
              id="contacts-tab"
              role="tab"
              aria-controls="contacts"
              aria-selected={router.asPath === `/${user_id}/following-post`}
            >
              Following
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Tabs;
