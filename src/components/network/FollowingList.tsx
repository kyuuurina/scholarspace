import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ScrollableModal from "./ScrollableModal";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import Image from "next/image";
import { useUser } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";
import { useRouterId } from "~/utils/routerId";
import { useFetchFollowing } from "~/utils/follow";

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

interface FollowingListProps {
  profiles: Profile[];
}

const FollowingList: React.FC<FollowingListProps> = ({ profiles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followingProfiles, setFollowingProfiles] = useState<Profile[]>(profiles);
  const user = useUser();
  const router = useRouter();

  const profileId = useRouterId();

  const { data: followingCount, refetch: refetchFollowingCount } = api.follow.getFollowingCount.useQuery({
    userId: profileId || "", // Use the profileId of the user being viewed
  });

  const { data: fetchedProfiles, refetch: refetchFollowingProfiles } = api.follow.getFollowingList.useQuery({
    userId: profileId || "",
  });

  // Use the useFetchFollowings hook to get followers data
  const { followingData, followingLoading, followingError } = useFetchFollowing();

  useEffect(() => {
    // Update follower profiles state when new data is fetched
    if (followingData) {
      const flatProfiles = followingData.flat();
      setFollowingProfiles(flatProfiles);
    }
  }, [followingData]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      <button onClick={openModal} className="font-semibold">
      {followingData ? followingData.length.toString() + " Followings" : "Followings"}
      </button>
      <ScrollableModal show={isModalOpen} onClose={closeModal} title="Following">
        {profiles && profiles.length === 0 ? (
          <p>No Following accounts.</p>
        ) : (
          <ul>
            {profiles.map((profile, index) => (
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
              </li>
            ))}
          </ul>
        )}
      </ScrollableModal>
    </div>
  );
};

export default FollowingList;
