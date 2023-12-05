import Image from "next/image";
import AvatarPlaceholder from "./AvatarPlaceholder";

import type { user } from "@prisma/client";

const Avatar = (user: user): React.ReactNode => {
  if (user?.avatar_url) {
    return (
      <Image
        key={user.avatar_url}
        src={user.avatar_url}
        alt="Workspace member avatar"
        width={30}
        height={30}
        className="rounded-full"
      />
    );
  } else {
    return (
      <div key={user?.avatar_url} className="w-8 rounded-full">
        <AvatarPlaceholder name={user?.email || "SS"} />
      </div>
    );
  }
};

export default Avatar;
