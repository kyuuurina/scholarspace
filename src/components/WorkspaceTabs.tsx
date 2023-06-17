import Link from "next/link";
import { useRouter } from "next/router";

export function WorkspaceTabs() {
  const router = useRouter();

  return (
    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
      <ul
        className="-mb-px flex flex-wrap text-center text-sm font-medium"
        id="myTab"
        data-tabs-toggle="#myTabContent"
        role="tablist"
      >
        <li className="mr-2" role="presentation">
          <Link href={`/workspace/${router.query.id.toString()}`}>
            <span
              className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 ${
                router.asPath === `/workspace/${router.query.id.toString()}`
                  ? "border-blue-500 text-blue-500"
                  : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              id="dashboard-tab"
              role="tab"
              aria-controls="dashboard"
              aria-selected={
                router.asPath === `/workspace/${router.query.id.toString()}`
              }
            >
              Dashboard
            </span>
          </Link>
        </li>
        <li role="presentation">
          <Link href={`/workspace/${router.query.id.toString()}/members`}>
            <span
              className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 ${
                router.asPath ===
                `/workspace/${router.query.id.toString()}/members`
                  ? "border-blue-500 text-blue-500"
                  : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              id="contacts-tab"
              role="tab"
              aria-controls="contacts"
              aria-selected={
                router.asPath ===
                `/workspace/${router.query.id.toString()}/members`
              }
            >
              Members
            </span>
          </Link>
        </li>
        <li className="mr-2" role="presentation">
          <Link href={`/workspace/${router.query.id.toString()}/settings`}>
            <span
              className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 ${
                router.asPath ===
                `/workspace/${router.query.id.toString()}/settings`
                  ? "border-blue-500 text-blue-500"
                  : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              id="settings-tab"
              role="tab"
              aria-controls="settings"
              aria-selected={
                router.asPath ===
                `/workspace/${router.query.id.toString()}/settings`
              }
            >
              Settings
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
