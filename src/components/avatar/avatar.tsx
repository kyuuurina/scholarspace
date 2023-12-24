import Image from "next/image";
import AvatarPlaceholder from "./AvatarPlaceholder";
import type { user } from "@prisma/client";

type AvatarProps = {
  user?: user | null;
  avatar_url?: string | null;
  email?: string | null;
};

const Avatar: React.FC<AvatarProps> = ({ user, avatar_url, email }) => {
  if (avatar_url) {
    if (email) {
      return (
        <Image
          key={avatar_url}
          src={avatar_url}
          alt="Workspace member avatar"
          width={30}
          height={30}
          className="rounded-full"
        />
      );
    } else {
      return (
        <Image
          src={avatar_url}
          alt={user?.name || email || "Avatar"}
          width={32}
          height={32}
          className="rounded-full"
        />
      );
    }
  } else {
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
  }
};

export default Avatar;
