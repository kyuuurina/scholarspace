import { FiUsers, FiSettings } from "react-icons/fi";
import Link from "next/link";

// utils
import { useRouterId } from "~/utils/routerId";

type HeaderButtonProps = {
  type: "members" | "settings";
};

const HeaderButton: React.FC<HeaderButtonProps> = ({ type }) => {
  const workspaceId = useRouterId();

  let icon = null;
  let url = "/";

  if (workspaceId) {
    switch (type) {
      case "members":
        icon = <FiUsers />;
        url = `/workspace/${workspaceId}/members`;
        break;
      case "settings":
        icon = <FiSettings />;
        url = `/workspace/${workspaceId}/settings`;
        break;
      default:
        break;
    }
  }

  return (
    <>
      {workspaceId ? (
        <Link href={url}>
          <button className="rounded-md border border-gray-300 bg-gray-200 p-2 hover:bg-gray-400">
            {icon}
          </button>
        </Link>
      ) : (
        // fallback
        <button
          className="cursor-not-allowed rounded-md border border-gray-300 bg-gray-200 p-2"
          disabled
        >
          {icon}
        </button>
      )}
    </>
  );
};

export default HeaderButton;
