import Link from "next/link";
import { useRouter } from "next/router";

const WorkspaceTabs: React.FC = () => {
  const router = useRouter();

  // Check if router.query and router.query.id are defined before accessing their values
  const workspaceId =
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
          <Link href={`/workspace/${workspaceId}`}>
            <span
              className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 ${
                router.asPath === `/workspace/${workspaceId}`
                  ? "border-blue-500 text-blue-500"
                  : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              id="dashboard-tab"
              role="tab"
              aria-controls="dashboard"
              aria-selected={router.asPath === `/workspace/${workspaceId}`}
            >
              Dashboard
            </span>
          </Link>
        </li>
        <li role="presentation">
          <Link href={`/workspace/${workspaceId}/members`}>
            <span
              className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 ${
                router.asPath === `/workspace/${workspaceId}/members`
                  ? "border-blue-500 text-blue-500"
                  : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              id="contacts-tab"
              role="tab"
              aria-controls="contacts"
              aria-selected={
                router.asPath === `/workspace/${workspaceId}/members`
              }
            >
              Members
            </span>
          </Link>
        </li>
        <li className="mr-2" role="presentation">
          <Link href={`/workspace/${workspaceId}/settings`}>
            <span
              className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 ${
                router.asPath === `/workspace/${workspaceId}/settings`
                  ? "border-blue-500 text-blue-500"
                  : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              id="settings-tab"
              role="tab"
              aria-controls="settings"
              aria-selected={
                router.asPath === `/workspace/${workspaceId}/settings`
              }
            >
              Settings
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default WorkspaceTabs;
