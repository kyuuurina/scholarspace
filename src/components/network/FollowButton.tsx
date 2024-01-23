import { api } from '~/utils/api';
import { useState, useEffect } from 'react';
import { useFetchFollowStatus } from '~/utils/follow';
import { useRouter } from 'next/router';

interface FollowButtonProps {
  userId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId }) => {
  const { mutate: toggleFollowMutation } = api.follow.toggleFollow.useMutation();
  const { data: followStatus, isLoading, error } = api.follow.getFollowStatus.useQuery({
    userId,
  });
  const router = useRouter();

  const isFollowing = followStatus?.isFollowing || false;

  const handleFollowClick = async () => {
    try {
      // Use toggleFollowMutation without await
      toggleFollowMutation({ userId });

      // Wait for the mutation to complete before refetching the follow status
      await new Promise((resolve) => setTimeout(resolve, 0));

      router.reload();
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const buttonClassName = isFollowing ? 'bg-blue-500' : 'bg-green-500';

  return (
    <button
      className={`${buttonClassName} text-white px-4 py-2 rounded`}
      onClick={handleFollowClick}
      disabled={isLoading} // Disable the button while loading
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;

