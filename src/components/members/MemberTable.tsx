import type { Member } from "~/types/member";
import MemberRow from "./MemberRow";
type MemberTableProps = {
  filteredMembers: Member[];
  handleRoleChange: (memberId: string, newRole: string) => void;
  handleDeleteMember: (memberId: string) => void;
  userWorkspaceRole: string | null | undefined;
  isPersonal: boolean | undefined;
  ownerId?: string | undefined | null;
};

const MemberTable: React.FC<MemberTableProps> = ({
  filteredMembers,
  handleRoleChange,
  handleDeleteMember,
  userWorkspaceRole,
  isPersonal,
  ownerId,
}) => {
  return (
    <table className="w-full text-left text-sm text-gray-500">
      <thead className="bg-gray-50 text-xs uppercase text-gray-700">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Role
          </th>
          <th scope="col" className="px-6 py-3">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredMembers.map((member) => (
          <MemberRow
            key={member.memberId}
            member={member}
            handleRoleChange={handleRoleChange}
            handleDeleteMember={handleDeleteMember}
            userWorkspaceRole={userWorkspaceRole}
            isPersonal={isPersonal}
            ownerId={ownerId}
          />
        ))}
      </tbody>
    </table>
  );
};

export default MemberTable;
