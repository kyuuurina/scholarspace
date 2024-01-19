import Image from "next/image";
import AvatarPlaceholder from "./AvatarPlaceholder";
import type { profile } from "@prisma/client";

type AvatarProps = {
  profile?: profile | null;
  avatar_url?: string | null;
  email?: string | null;
};

const Avatar: React.FC<AvatarProps> = ({ profile, avatar_url, email }) => {
  if (avatar_url) {
    if (email) {
      return (
        <Image
          key={avatar_url}
          src={avatar_url}
          alt="avatar"
          width={30}
          height={30}
          className="rounded-full"
        />
      );
    } else {
      return (
        <Image
          src={avatar_url}
          alt={profile?.name || "Avatar"}
          width={32}
          height={32}
          className="rounded-full"
        />
      );
    }
  } else {
    if (profile?.avatar_url) {
      return (
        <Image
          key={profile.avatar_url}
          src={profile.avatar_url}
          alt="avatar"
          width={30}
          height={30}
          className="rounded-full"
        />
      );
    } else {
      return (
        <div key={profile?.avatar_url} className="w-8 rounded-full">
          <AvatarPlaceholder name={profile?.name || "SS"} />
        </div>
      );
    }
  }
};

export default Avatar;
