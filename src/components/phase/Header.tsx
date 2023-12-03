import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useFetchProject } from "~/utils/project";
import { api } from "~/utils/api";
import { FiLayout } from "react-icons/fi";
import type { phase } from "@prisma/client";

type HeaderProps = {
  phases: phase[];
  onSelectPhase: (phaseId: string) => void;
  selectedPhase: string;
};

import { useState } from "react";

const Header: React.FC<HeaderProps> = ({
  phases,
  onSelectPhase,
  selectedPhase,
}) => {
  const router = useRouter();
  const id = router.query && router.query.id ? router.query.id.toString() : "";
  // states for isAdding button
  const [isAdding, setIsAdding] = useState(false);

  const { name } = useFetchProject();

  // create phase
  const createPhase = api.phase.create.useMutation();

  // function to create phase with default name phase1
  const handleCreatePhase = () => {
    // if isAdding is true, then exit the function
    if (isAdding) return;
    else {
      setIsAdding(true);
      // await for createPhase to finish executing, then set isAdding to false
      createPhase.mutate(
        {
          project_id: id,
          name: "phase1",
        },
        {
          onSuccess: () => {
            setIsAdding(false);
            router.reload();
          },
        }
      );
    }
  };

  return (
    <div className="flex w-full flex-col flex-wrap border-b bg-white p-4 pb-0">
      {/* Project Header */}
      <div className="flex flex-row justify-between pb-1">
        <h2 className="max-w-[80%] truncate text-2xl font-semibold">{name}</h2>
        {/* add phase button */}
        <div className="flex justify-end">
          <button
            className="rounded-md border border-gray-300 bg-gray-200 p-1 hover:bg-gray-400"
            onClick={() => handleCreatePhase()}
          >
            <div className="flex items-center">
              <FiLayout />
              <span className="ml-2 text-xs">Add Phase</span>
            </div>
          </button>
        </div>
      </div>
      {/* Tabs of phases*/}
      <div>
        <ul className="hidden text-center text-sm text-gray-800 sm:flex">
          {phases?.map((phase) => (
            <li
              key={phase.id}
              className={`rounded-t-md border ${
                selectedPhase === phase.id ? "bg-gray-300" : "bg-gray-100"
              } p-2 px-3 py-1 hover:cursor-pointer hover:bg-gray-50 hover:text-gray-700`}
              onClick={() => onSelectPhase(phase.id)}
            >
              {phase.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Header;
