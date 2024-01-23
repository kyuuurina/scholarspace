import Image from "next/image";
import AvatarPlaceholder from "./AvatarPlaceholder";
import type { profile, user } from "@prisma/client";
import { BASE_AVATAR_URL } from "~/utils/supabase-storage";

type AvatarProps = {
  profile?: profile | null;
  user?: user;
};

const Avatar: React.FC<AvatarProps> = ({ user, profile }) => {
  if (user) {
    if (user.has_avatar) {
      return (
        <Image
          key={user.id}
          src={`${BASE_AVATAR_URL}/${user.id}`}
          alt="avatar"
          width={30}
          height={30}
          className="rounded-full"
        />
      );
    } else {
      return (
        <div key={user.id} className="w-8 rounded-full">
          <AvatarPlaceholder name={user.name} />
        </div>
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
