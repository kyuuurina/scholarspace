// utils/follow.ts
import { api } from "./api";
import { useRouterId } from "./routerId";

type FollowData = {
  isFollowing: boolean;
  followerCount: number;
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar: string | null;
};

export const useFetchFollow = (targetUserId: string) => {
  const userId: string = useRouterId();

  // Adjust the query function based on your actual API structure
  const follow = api.follow.mutation({
    targetUserId,
  });

  const { isFollowing, followerCount, targetUserId: targetUserIdFromData, targetUserName, targetUserAvatar } =
    follow.data || {};

  const { isLoading, error } = follow;

  return {
    isFollowing,
    followerCount,
    targetUserId: targetUserIdFromData,
    targetUserName,
    targetUserAvatar,
    isLoading,
    error,
  };
};

export const useFollowUser = (targetUserId: string) => {
  const userId: string = useRouterId();

  const { mutate: followUser, ...followMutation } = api.follow.followMutation();

  const follow = () => {
    followUser({ targetUserId });
  };

  return {
    follow,
    ...followMutation,
  };
};

export const useUnfollowUser = (targetUserId: string) => {
  const userId: string = useRouterId();

  const { mutate: unfollowUser, ...unfollowMutation } = api.follow.unfollowMutation();

  const unfollow = () => {
    unfollowUser({ targetUserId });
  };

  return {
    unfollow,
    ...unfollowMutation,
  };
};
