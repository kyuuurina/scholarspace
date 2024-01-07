import Link from "next/link";
import { useRouter } from "next/router";
import { useFetchProject } from "~/utils/project";
import { useRouterId } from "../../utils/routerId";
import React, { useState, useRef } from "react";
import { api } from "~/utils/api";
import type { phase } from "@prisma/client";
import { FiLayout } from "react-icons/fi";
import { useClickAway } from "@uidotdev/usehooks";
import PhaseActions from "./PhaseActions";

type HeaderProps = {
  phases: phase[];
  onSelectPhase: (phaseId: string) => void;
  selectedPhase: string;
};

const Header: React.FC<HeaderProps> = ({
  phases,
  onSelectPhase,
  selectedPhase,
}) => {
  const router = useRouter();
  const id = useRouterId();
  const { name } = useFetchProject();

  // states for isAdding button
  const [isAdding, setIsAdding] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [phaseActionStates, setPhaseActionStates] = useState<{
    [key: string]: boolean;
  }>({});

  // states for renaming phase
  const [isRenaming, setIsRenaming] = useState<{ [key: string]: boolean }>({});
  const [newPhaseNames, setNewPhaseNames] = useState<{ [key: string]: string }>(
    {}
  );

  const handleContextMenu = (
    event: React.MouseEvent<HTMLLIElement>,
    phaseId: string
  ) => {
    event.preventDefault();
    setPhaseActionStates((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const ref = useClickAway(() => {
    // Close phase actions for all phases
    setPhaseActionStates((prev) => {
      const nextState = { ...prev };
      for (const phaseId in nextState) {
        nextState[phaseId] = false;
      }
      return nextState;
    });
  });

  // create phase
  const createPhase = api.phase.create.useMutation();
  // rename phase
  const renamePhase = api.phase.renamePhase.useMutation();

  // function to trigger create phase button
  const onClickCreatePhase = () => {
    if (isAdding) return;

    setIsAdding(true);
    setNewPhaseName("Phase1");
    setIsEditing(true);

    // Set focus to the input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  // function to trigger rename phase
  const onClickRenamePhase = (phaseId: string) => {
    setIsRenaming((prev) => ({ ...prev, [phaseId]: true }));
    setNewPhaseNames((prev) => ({
      ...prev,
      [phaseId]: phases.find((phase) => phase.id === phaseId)?.name || "",
    }));
  };

  // function to handle phase name change
  const handlePhaseNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPhaseName(event.target.value);
  };

  // function to handle submit on Enter key press
  const handleInputKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      // Perform the submit logic here
      await createPhase.mutateAsync(
        {
          project_id: id,
          name: newPhaseName,
        },
        {
          onSuccess: () => {
            setIsAdding(false);
            setIsEditing(false);
            router.reload();
          },
        }
      );
    }
  };

  // function to handle rename input change
  const handleRenameInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    phaseId: string
  ) => {
    setNewPhaseNames((prev) => ({ ...prev, [phaseId]: event.target.value }));
  };

  // function to handle rename submit on Enter key press
  const handleRenameInputKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    phaseId: string
  ) => {
    if (event.key === "Enter") {
      // Perform the submit logic here
      await renamePhase.mutateAsync(
        {
          id: phaseId,
          name: newPhaseNames[phaseId] || "",
        },
        {
          onSuccess: () => {
            setIsRenaming((prev) => ({ ...prev, [phaseId]: false }));
            router.reload();
          },
        }
      );

      setIsRenaming((prev) => ({ ...prev, [phaseId]: false }));
      router.reload();
    }
  };

  return (
    <div className="flex w-full flex-col flex-wrap border-b bg-white p-4 pb-0">
      {/* Project Header */}
      <div className="flex flex-row justify-between pb-1">
        {/* breadcrumb workspace and project */}
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-gray-700">
          <Link href="/workspace">
            <span className="ml-1 flex items-center text-xs hover:underline">
              MYSIGSQRA
            </span>
          </Link>
          <span className="mx-1">/</span>
          <Link href={`/project/${id}`}>
            <span className="ml-1 flex items-center text-xs font-semibold text-purple-800 hover:underline">
              {name}
            </span>
          </Link>
        </div>
        {/* add phase button */}
        <div className="flex justify-end">
          {isEditing ? (
            <input
              type="text"
              value={newPhaseName}
              onChange={handlePhaseNameChange}
              onKeyDown={handleInputKeyPress}
              onBlur={() => setIsEditing(false)}
              ref={inputRef}
              className="mr-2 rounded-md border border-gray-300 p-1"
            />
          ) : (
            <button
              className="rounded-md border border-gray-300 bg-gray-200 p-1 hover:bg-gray-400"
              onClick={() => onClickCreatePhase()}
            >
              <div className="flex items-center">
                <FiLayout />
                <span className="ml-2 text-xs">Add Phase</span>
              </div>
            </button>
          )}
        </div>
      </div>
      {/* Tabs of phases*/}
      <div>
        <ul className="hidden text-center text-sm text-gray-800 sm:flex">
          {phases?.map((phase) => (
            <React.Fragment key={phase.id}>
              <li
                ref={ref as React.MutableRefObject<HTMLLIElement>}
                onContextMenu={(event) => handleContextMenu(event, phase.id)}
                className={`rounded-t-md border ${
                  selectedPhase === phase.id ? "bg-gray-300" : "bg-gray-100"
                } relative p-2 px-3 py-1 hover:cursor-pointer hover:bg-gray-50 hover:text-gray-700`}
                onClick={() => onSelectPhase(phase.id)}
              >
                {isRenaming[phase.id] ? (
                  <input
                    type="text"
                    value={newPhaseNames[phase.id]}
                    onChange={(event) =>
                      handleRenameInputChange(event, phase.id)
                    }
                    onKeyDown={(event) =>
                      handleRenameInputKeyPress(event, phase.id)
                    }
                    onBlur={() =>
                      setIsRenaming((prev) => ({ ...prev, [phase.id]: false }))
                    }
                    autoFocus
                    className="rounded-md border border-gray-300 p-1"
                  />
                ) : (
                  <div onDoubleClick={() => onClickRenamePhase(phase.id)}>
                    {phase.name}
                  </div>
                )}
                {phaseActionStates[phase.id] && (
                  <PhaseActions
                    phase_id={phase.id}
                    setIsCellActionOpen={(isOpen) =>
                      setPhaseActionStates((prev) => ({
                        ...prev,
                        [phase.id]: isOpen,
                      }))
                    }
                    onClickRename={() => onClickRenamePhase(phase.id)} // Pass the function to trigger renaming mode
                    onClosePhaseActions={() =>
                      setPhaseActionStates((prev) => ({
                        ...prev,
                        [phase.id]: false,
                      }))
                    }
                  />
                )}
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Header;
