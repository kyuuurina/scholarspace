import { useState } from "react";
import { TbSwitchHorizontal } from "react-icons/tb";
import dynamic from "next/dynamic";

// components
const WorkspaceDropdownList = dynamic(() => import("./WorkspaceDropdownList"), {
  loading: () => null,
  ssr: false,
});

const WorkspaceDropdown: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [workspaceMenu, setWorkspaceMenu] = useState(false);

  const handleToggleWorkspace = () => {
    setWorkspaceMenu(!workspaceMenu);
  };

  return (
    <div>
      <button
        className="inline-flex w-44 items-center rounded-md bg-purple-accent-1 px-4 py-2.5 text-center text-xs font-medium hover:bg-purple-accent-2"
        type="button"
        onClick={handleToggleWorkspace}
      >
        <div className="flex w-full items-center justify-between space-x-2 text-white">
          <span>Switch Workspace</span>
          <TbSwitchHorizontal className="h-4 w-4" />
        </div>
      </button>

      <WorkspaceDropdownList workspaceMenu={workspaceMenu} onClick={onClick} />
    </div>
  );
};

export default WorkspaceDropdown;
