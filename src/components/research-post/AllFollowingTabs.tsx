import Link from "next/link";
import { useRouter } from "next/router";

const Tabs: React.FC = () => {
  const router = useRouter();

  // Check if router.query and router.query.id are defined before accessing their values
  const user_id =
    router.query && router.query.id ? router.query.id.toString() : "";

  return (
    <div className="border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
      <ul className="-mb-px flex flex-wrap">
        {/* "All tab" */}
        <li className="mr-2 flex-1">
          <Link href={`/${user_id}`}>
            <span
              className={`inline-block rounded-t-lg p-4 hover:text-gray-600 dark:hover:text-gray-300 ${
                router.asPath === `/`
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "border-transparent"
              }`}
            >
              All
            </span>
          </Link>
        </li>

        {/* "Following tab" */}
        <li className="mr-2 flex-1">
          <Link href={`${user_id}/following-post`}>
            <span
              className={`inline-block rounded-t-lg p-4 hover:text-gray-600 dark:hover:text-gray-300 ${
                router.asPath === `/${user_id}/following-post`
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "border-transparent"
              }`}
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
