import React, { useState, useEffect } from "react";
import ScrollableModal from "./ScrollableModal";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import Image from "next/image";
import { useUser } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";

interface Profile {
  profile_id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  about_me: string | null;
  research_interest: string | null;
  collab_status: string | null;
  skills: string | null;
}

interface FollowerListProps {
  profiles: Profile[];
}

const FollowerList: React.FC<FollowerListProps> = ({ profiles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUser();
  const { data: followerCount, refetch: refetchFollowerCount } = api.follow.getFollowersCount.useQuery({
    userId: user?.id || "", // Provide the userId for which you want to get followers count
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const removeFollower = api.follow.removeFollower.useMutation();

  const handleRemove = async (profileId: string) => {
    try {
      const userIdToRemove = profileId;
      await removeFollower.mutateAsync({ userId: userIdToRemove });

      console.log(`Remove follower with profileId: ${profileId}`);

      // Manually trigger a refetch of followers count
      await refetchFollowerCount();
    } catch (error) {
      console.error("Error removing follower:", error);
      // Handle error as needed
    }
  };

  return (
    <div>
      <button onClick={openModal}>
        {followerCount ? followerCount.followersCount.toString() + " Followers" : "Followers"}
      </button>
      <ScrollableModal show={isModalOpen} onClose={closeModal} title="Followers">
        {profiles && profiles.length === 0 ? (
          <p>No Followers.</p>
        ) : (
          <ul>
            {profiles.map((profile, index) => (
              <li key={profile.profile_id} className="flex items-center justify-between space-x-2 mb-2">
                <div className="flex items-center space-x-2">
                  {profile.avatar_url ? (
                    <Image
                      src={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/avatar/${profile.avatar_url}`}
                      alt={`Avatar of ${profile.name}`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <AvatarPlaceholder name={profile.name} />
                  )}
                  <p>{profile.name}</p>
                </div>
                {user && (
                  <button onClick={() => handleRemove(profile.profile_id)} className="text-red-500">
                    Remove
                  </button>
                )}
                {/* Include other profile details as needed */}
              </li>
            ))}
          </ul>
        )}
      </ScrollableModal>
    </div>
  );
};

export default FollowerList;
