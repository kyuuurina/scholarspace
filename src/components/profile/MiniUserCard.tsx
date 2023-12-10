//Mini cards that shows results of profile search --> profile picture, name, collaboration status

import Link from "next/link";
import AvatarPlaceholder from "~/components/avatar/AvatarPlaceholder";

type MiniUserCardProps = {
    // an object of an array of users
    otherUser: {
        profile_id: string;
        name: string;
        collab_status: string;
    };
};

const MiniUserCard: React.FC<MiniUserCardProps> = ({ otherUser }) => {
    return (
        <Link
            href={`/profile/${otherUser.profile_id}`}
            className="flex w-full items-center space-x-5 rounded-lg border border-gray-200 bg-white p-4 shadow hover:bg-gray-100"
        >
            <div>
                <div className="aspect:square h-20 w-20">
                    <AvatarPlaceholder name={otherUser.name} shape="circle" />
                </div>
                <div>
                    {otherUser.collab_status}
                </div>
            </div>
        </Link>
    );
};

export default MiniUserCard;