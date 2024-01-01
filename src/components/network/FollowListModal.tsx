import React from "react";
import ScrollableModal from "./ScrollableModal";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import Link from "next/link";

interface FollowListModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  follows: Array<{
    // profile_id: string;
    user_id: string;
    name: string;
    avatar_url?: string | null;
  }>;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ show, onClose, title, follows }) => {
  return (
    <ScrollableModal show={show} onClose={onClose} title={title}>
      {follows.map((follow) => (
        <div key={follow.user_id} className="flex items-center">
          <Link href={`/manage-profile/${follow.user_id}`}>
            <div className="aspect:square h-10 w-10 cursor-pointer">
              {follow.avatar_url ? (
                <img src={follow.avatar_url} alt={`${follow.name}'s avatar`} className="h-full w-full rounded-full" />
              ) : (
                <AvatarPlaceholder name={follow.name} shape="circle" />
              )}
            </div>
          </Link>
          <div className="ml-2">
            <Link href={`/manage-profile/${follow.user_id}`}>
              <span className="cursor-pointer inline-block max-w-full sm:max-w-[150px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                {follow.name}
              </span>
            </Link>
          </div>
        </div>
      ))}
    </ScrollableModal>
  );
};

export default FollowListModal;
