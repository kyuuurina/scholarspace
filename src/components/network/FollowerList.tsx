import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ScrollableModal from "./ScrollableModal";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import Image from "next/image";
import { useUser } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";
import { useRouterId } from "~/utils/routerId";

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
  const [followerProfiles, setFollowerProfiles] = useState<Profile[]>(profiles); // State to store follower profiles
  const user = useUser();
  const router = useRouter();

  const profileId = useRouterId();

  const { data: followerCount, refetch: refetchFollowerCount } = api.follow.getFollowersCount.useQuery({
    userId: profileId || "",
  });

  const { data: fetchedProfiles, refetch: refetchFollowerProfiles } = api.follow.getFollowersList.useQuery({
    userId: profileId || "",
  });

  // Update follower profiles state when new data is fetched
  useEffect(() => {
    if (fetchedProfiles) {
      // Flatten the 2D array to a 1D array
      const flatProfiles = fetchedProfiles.flat();
      // setFollowerProfiles(flatProfiles);
    }
  }, [fetchedProfiles]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const removeFollower = api.follow.removeFollower.useMutation();

  const handleRemove = async (userId: string) => {
    try {
      const userIdToRemove = userId;
      await removeFollower.mutateAsync({ userId: userIdToRemove });

      console.log(`Remove follower with userId: ${userId}`);

      // Manually trigger a refetch of followers count
      await refetchFollowerCount();

      // Manually trigger a refetch of follower profiles
      await refetchFollowerProfiles();
    } catch (error) {
      console.error("Error removing follower:", error);
      // Handle error as needed
    }
  };

  // Close the modal when navigating to the profile page
  const handleProfileLinkClick = async (profileId: string) => {
    closeModal();
    try {
      await router.push(`/manage-profile/${profileId}`);
    } catch (error) {
      console.error("Error navigating to profile page:", error);
    }
  };

  return (
    <div>
      <button onClick={openModal}>
        {followerCount ? followerCount.followersCount.toString() + " Followers" : "Followers"}
      </button>
      <ScrollableModal show={isModalOpen} onClose={closeModal} title="Followers">
        {followerProfiles && followerProfiles.length === 0 ? (
          <p>No Followers.</p>
        ) : (
          <ul>
            {followerProfiles.map((profile, index) => (
              <li key={profile.profile_id} className="flex items-center justify-between space-x-2 mb-2">
                <div className="flex items-center space-x-2">
                  <div className="aspect-w-1 aspect-h-1 h-10 w-10">
                    {profile.avatar_url ? (
                      <span className="relative inline-block cursor-pointer">
                        <div className="h-10 w-10">
                          <Link href={`/manage-profile/${profile.profile_id}`}>
                            <span onClick={() => handleProfileLinkClick(profile.profile_id)}>
                              <Image
                                src={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/avatar/${profile.avatar_url}`}
                                alt={`Avatar of ${profile.name}`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full"
                              />
                            </span>
                          </Link>
                        </div>
                        <span className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 opacity-50 rounded-full" />
                      </span>
                    ) : (
                      <AvatarPlaceholder name={profile.name} shape="circle" />
                    )}
                  </div>
                  <p>
                    <Link href={`/manage-profile/${profile.profile_id}`}>
                      <span onClick={() => handleProfileLinkClick(profile.profile_id)}>
                        {profile.name}
                      </span>
                    </Link>
                  </p>
                </div>
                {user && (
                  <button onClick={() => handleRemove(profile.user_id)} className="text-red-500">
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
