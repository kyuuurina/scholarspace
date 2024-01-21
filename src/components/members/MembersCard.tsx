import Link from "next/link";
import Card from "../Card";
import Avatar from "../avatar/avatar";

import type { user } from "@prisma/client";

type MembersCardProps = {
  id: string;
  name: string;
  users?: user[];
};

const MembersCard: React.FC<MembersCardProps> = ({ id, name, users }) => {
  return (
    <Card title={"Members"}>
      <div className="flex flex-row gap-2">
        {users
          ?.slice(0, 5)
          .map((user) => (user ? <Avatar key={user.id} user={user} /> : null))}
        {users && users.length > 5 && (
          <Link
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-xs font-medium text-white"
            href={`/${name}/${id}/members`}
          >
            <span>{users?.length - 5}+</span>
          </Link>
        )}
      </div>
    </Card>
  );
};

export default MembersCard;
