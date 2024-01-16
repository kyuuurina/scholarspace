// MiniUserCard.tsx

import Link from "next/link";
import AvatarPlaceholder from "~/components/avatar/AvatarPlaceholder";
import Image from "next/image";

type MiniUserCardProps = {
  otherUser: {
    profile_id: string;
    name: string;
    avatar_url: string | null;
    collab_status: string;
  };
};

const MiniUserCard: React.FC<MiniUserCardProps> = ({ otherUser }) => {
  return (
    <Link
      href={`/manage-profile/${otherUser.profile_id}`}
      className="flex w-full items-center space-x-5 rounded-lg border border-gray-200 bg-white p-4 shadow hover:bg-gray-100"
    >
      <div className="flex items-center">
        <div className="aspect-w-1 aspect-h-1 h-20 w-20">
          {otherUser.avatar_url ? (
            <span className="relative inline-block cursor-pointer">
              <div className="h-20 w-20">
                <Image
                  src={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/avatar/${otherUser.avatar_url}`}
                  alt={otherUser.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <span className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 opacity-50 rounded-full" />
            </span>
          ) : (
            <AvatarPlaceholder name={otherUser.name} shape="circle" />
          )}
        </div>
        <div className="ml-4">
          <div className="text-sm font-semibold">{otherUser.name}</div>
          <div>{otherUser.collab_status}</div>
        </div>
      </div>
    </Link>
  );
};

export default MiniUserCard;
