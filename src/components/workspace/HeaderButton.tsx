import { FiUsers, FiSettings } from "react-icons/fi";
import Link from "next/link";

// utils
import { useRouterId } from "~/utils/routerId";

type HeaderButtonProps = {
  type: "members" | "settings";
  purpose: "workspace" | "project";
};

const HeaderButton: React.FC<HeaderButtonProps> = ({ type, purpose }) => {
  const id = useRouterId();

  let icon = null;
  let url = "/";

  if (id) {
    switch (type) {
      case "members":
        icon = <FiUsers />;
        url = `/${purpose}/${id}/members`;
        break;
      case "settings":
        icon = <FiSettings />;
        url = `/${purpose}/${id}/settings`;
        break;
      default:
        break;
    }
  }

  return (
    <>
      {id ? (
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
