//to do: use supabase storage for avatar

import Link from "next/link";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import Image from "next/image";

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
      <Link href={`/manage-profile/${profiles.profile_id}`}>
        <div className="aspect-w-1 aspect-h-1 h-10 w-10 cursor-pointer">
          {profiles.avatar_url ? (
            <span className="relative inline-block cursor-pointer">
              <div className="h-10 w-10">
                <Image
                  src={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/avatar/${profiles.avatar_url}`}
                  alt={profiles.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <span className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 opacity-50 rounded-full" />
            </span>
          ) : (
            <AvatarPlaceholder
              name={profiles.name}
              shape="circle"
            />
          )}
        </div>
      </Link>
      <div className="ml-2">
        <Link href={`/manage-profile/${profiles.profile_id}`}>
          <span className="cursor-pointer inline-block max-w-full sm:max-w-[150px] overflow-hidden whitespace-nowrap overflow-ellipsis">
            {profiles.name}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ProfileRecommendation;
