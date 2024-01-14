import React, { useState } from "react";
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

interface FollowingListProps {
  profiles: Profile[];
}

const FollowingList: React.FC<FollowingListProps> = ({ profiles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUser();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div>
      {profiles && profiles.length === 0 ? (
        <p>No Following.</p>
      ) : (
        <div>
          <button onClick={openModal}>Following</button>
          <ScrollableModal show={isModalOpen} onClose={closeModal} title="Following">
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
                </li>
              ))}
            </ul>
          </ScrollableModal>
        </div>
      )}
    </div>
  );
};

export default FollowingList;
