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
        width={40}
        height={40}
        className="rounded-full"
      />
    );
  } else {
    return (
      <div key={user?.avatar_url} className="w-10 rounded-full">
        <AvatarPlaceholder name={user?.email || "SS"} />

      </div>
    );
  }
};

export default Avatar;
