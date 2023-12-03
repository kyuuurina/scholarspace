import type { Member } from "~/types/member";
import Image from "next/image";
import AvatarPlaceholder from "~/components/avatar/AvatarPlaceholder";
import Select from "~/components/Select";
import { getCookie } from "cookies-next";

type RowProps = {
  //   member: Member;
  //   handleRoleChange: (memberId: string, newRole: string) => void;
  //   handleDeleteMember: (memberId: string) => void;
  //   userWorkspaceRole: string | null | undefined;
  //   isPersonal: boolean | undefined;
  //   ownerId?: string | undefined | null;
};

const Row: React.FC = (
  {
    //   member,
    //   handleRoleChange,
    //   handleDeleteMember,
    //   userWorkspaceRole,
    //   isPersonal,
    //   ownerId,
  }
) => {
  //   const userId = getCookie("User ID");
  //   const isPersonalOwner = member.memberId === ownerId && isPersonal;
  //   console.log(ownerId);
  //   console.log(member.memberId);

  return (
    <tr className="bg-white hover:bg-gray-100">
      <td className="flex items-center whitespace-nowrap px-6 py-4 font-medium text-gray-900">
        Column 1
      </td>
      <td className="px-6 py-4">Column 2</td>
      <td className="px-6 py-4">Column 3</td>
      <td className="flex items-center whitespace-nowrap px-6 py-4 font-medium text-gray-900">
        Column 1
      </td>
      <td className="px-6 py-4">Column 2</td>
    </tr>
  );
};

export default Row;
