// import type { Member } from "~/types/member";
import Row from "./Row";
import TableHeader from "./TableHeader";
// type TableProps = {
//   filteredMembers: Member[];
//   handleRoleChange: (memberId: string, newRole: string) => void;
//   handleDeleteMember: (memberId: string) => void;
//   userWorkspaceRole: string | null | undefined;
//   isPersonal: boolean | undefined;
//   ownerId?: string | undefined | null;
// };

const Table: React.FC = (
  {
    //   filteredMembers,
    //   handleRoleChange,
    //   handleDeleteMember,
    //   userWorkspaceRole,
    //   isPersonal,
    //   ownerId,
  }
) => {
  return (
    <table className="w-full text-left text-sm text-gray-500">
      <TableHeader />
      <tbody>
        {/* {filteredMembers.map((member) => ( */}
        <Row
        // key={member.memberId}
        // member={member}
        // handleRoleChange={handleRoleChange}
        // handleDeleteMember={handleDeleteMember}
        // userWorkspaceRole={userWorkspaceRole}
        // isPersonal={isPersonal}
        // ownerId={ownerId}
        />
        {/* // ))} */}
      </tbody>
    </table>
  );
};

export default Table;
