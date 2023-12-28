//to do: use supabase storage for avatar

import Link from "next/link";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";

interface ProfileRecommendationProps {
  profiles: {
    profile_id: string;
    user_id: string;
    name: string;
    avatar_url: string | null;
  };
}

const ProfileRecommendation: React.FC<ProfileRecommendationProps> = ({ profiles }) => {
  return (
    <div className="flex items-center">
      <Link href={`/profile/${profiles.profile_id}`}>
        <div className="aspect:square h-10 w-10 cursor-pointer">
          <AvatarPlaceholder 
            name={profiles.name} 
            shape="circle"
          />
        </div>
      </Link>
      <p className="ml-2">
        <Link href={`/profile/${profiles.profile_id}`}>
          <span className="cursor-pointer">{profiles.name}</span>
        </Link>
      </p>
    </div>
  );
};

export default ProfileRecommendation;
