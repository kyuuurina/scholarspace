import type { WorkspaceMember } from "~/types/member";
import Image from "next/image";
import AvatarPlaceholder from "~/components/avatar/AvatarPlaceholder";
import Select from "~/components/Select";
import { useUser } from "@supabase/auth-helpers-react";

type MemberRowProps = {
  member: WorkspaceMember;
  handleRoleChange: (memberId: string, newRole: string) => void;
  handleDeleteMember: (memberId: string) => void;
  userWorkspaceRole: string | null | undefined;
  isPersonal: boolean | undefined;
  ownerId?: string | undefined | null;
};

const MemberRow: React.FC<MemberRowProps> = ({
  member,
  handleRoleChange,
  handleDeleteMember,
  userWorkspaceRole,
  isPersonal,
  ownerId,
}) => {
  const isPersonalOwner = member?.user.id === ownerId && isPersonal;
  const user = useUser();
  const userId = user?.id || "";

  if (!member) {
    return null;
  }

  return (
    <tr className="bg-white hover:bg-gray-50">
      <td className="flex items-center whitespace-nowrap px-6 py-4 font-medium text-gray-900">
        {member?.user.profile?.avatar_url ? (
          <Image
            src={member?.user.profile?.avatar_url}
            alt="Jese image"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <div className="h-10 w-10 rounded-full">
            <AvatarPlaceholder name={member?.user.email} />
          </div>
        )}
        <div className="pl-3">
          <div className="text-base font-semibold">
            {member?.user.profile?.name}
          </div>
          <div className="font-normal text-gray-500">{member?.user.email}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        {userWorkspaceRole === "Researcher Admin" &&
        !isPersonalOwner &&
        member?.workspace_role ? (
          <Select
            initialValue={member?.workspace_role}
            onValueChange={(newRole) =>
              handleRoleChange(member?.userid, newRole)
            }
            options={["Researcher", "Researcher Admin", "Student"]}
          />
        ) : (
          <Select
            initialValue={member?.workspace_role} // added non-null assertion operator
            onValueChange={(newRole) =>
              handleRoleChange(member.userid, newRole)
            }
            disabled={true}
            options={["Researcher", "Researcher Admin", "Student"]}
          />
        )}
      </td>
      {member.is_collaborator ? (
        <td className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-gray-500"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-2 text-sm text-gray-400">
                External Collaborator
              </span>
            </div>
          </div>
        </td>
      ) : (
        <td className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-gray-500"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="10" fill="#6875f5"></circle>
              </svg>
              <span className="ml-2 text-sm text-gray-400">
                Internal Collaborator
              </span>
            </div>
          </div>
        </td>
      )}
      <td className="px-6 py-4">
        {member.userid != userId &&
          !isPersonalOwner && ( // Added the && operator here
            <button
              type="button"
              className={`font-medium 
          ${
            userWorkspaceRole === "Researcher Admin"
              ? "cursor-pointer text-purple-600 hover:underline"
              : "cursor-default text-gray-400"
          }
        `}
              onClick={() => {
                if (userWorkspaceRole === "Researcher Admin") {
                  handleDeleteMember(member.userid);
                }
              }}
              disabled={
                userWorkspaceRole !== "Researcher Admin" ||
                member.userid === userId
              }
            >
              Remove user
            </button>
          )}
      </td>
    </tr>
  );
};

export default MemberRow;
