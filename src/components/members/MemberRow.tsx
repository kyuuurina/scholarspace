import type { Member } from "~/types/member";
import Image from "next/image";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";
import Select from "~/components/Select";
import { getCookie } from "cookies-next";

type MemberRowProps = {
  member: Member;
  handleRoleChange: (memberId: string, newRole: string) => void;
  handleDeleteMember: (memberId: string) => void;
  userWorkspaceRole: string | null | undefined;
  isPersonal: boolean | undefined;
  ownerId: string | undefined | null;
};

const MemberRow: React.FC<MemberRowProps> = ({
  member,
  handleRoleChange,
  handleDeleteMember,
  userWorkspaceRole,
  isPersonal,
  ownerId,
}) => {
  const userId = getCookie("User ID");
  const isPersonalOwner = member.memberId === ownerId && isPersonal;
  console.log(ownerId);
  console.log(member.memberId);
  return (
    <tr className="bg-white hover:bg-gray-50">
      <td className="flex items-center whitespace-nowrap px-6 py-4 font-medium text-gray-900">
        {member.memberAvatarUrl ? (
          <Image
            src={member.memberAvatarUrl || ""}
            alt="Jese image"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <div className="h-10 w-10 rounded-full">
            <AvatarPlaceholder name={member.memberEmail || ""} />
          </div>
        )}
        <div className="pl-3">
          <div className="text-base font-semibold">{member.memberName}</div>
          <div className="font-normal text-gray-500">{member.memberEmail}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        {userWorkspaceRole === "Researcher Admin" && !isPersonalOwner ? (
          <Select
            initialValue={member.memberRole || "Researcher"}
            onValueChange={(newRole) =>
              handleRoleChange(member.memberId, newRole)
            }
          />
        ) : (
          <Select
            initialValue={member.memberRole || "Researcher"}
            onValueChange={(newRole) =>
              handleRoleChange(member.memberId, newRole)
            }
            disabled={true}
          />
        )}
      </td>
      <td className="px-6 py-4">
        {member.memberId != userId && (
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
                handleDeleteMember(member.memberId);
              }
            }}
            disabled={userWorkspaceRole === "Researcher Admin"}
          >
            Remove user
          </button>
        )}
      </td>
    </tr>
  );
};

export default MemberRow;
