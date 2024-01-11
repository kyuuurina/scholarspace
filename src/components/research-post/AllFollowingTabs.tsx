import Link from "next/link";
import { useRouter } from "next/router";

const Tabs: React.FC = () => {
  const router = useRouter();

  // Check if router.query and router.query.id are defined before accessing their values
  const user_id =
    router.query && router.query.id ? router.query.id.toString() : "";

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        {/* "All tab" */}
        <li className="mr-2 flex-1">
          {/* <Link href={`/home-rwp/${user_id}`}> */}
          <Link href={`/${user_id}`}>
            <span
              className={`inline-block p-4 rounded-t-lg hover:text-gray-600 dark:hover:text-gray-300 ${
                router.asPath === `/`
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "border-transparent"
              }`}
            >
              All
            </span>
          </Link>
        </li>

        {/* "Following tab" */}
        <li className="mr-2 flex-1">
          {/* <Link href={`/home-rwp/${user_id}/following-post`}> */}
          <Link href={`//${user_id}`}>
            <span
              className={`inline-block p-4 rounded-t-lg hover:text-gray-600 dark:hover:text-gray-300 ${
                router.asPath === `//${user_id}`
                  ? "text-purple-600 border-b-2 border-purple-600"
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
