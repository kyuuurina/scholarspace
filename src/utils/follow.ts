import { api } from "./api";
import {useRouterId} from "./routerId";
import {useQuery, useQueryClient} from "@tanstack/react-query";

export const useFetchFollowers = () => {
  const profile_id = useRouterId();

  // Fetch userId using getUserIdByProfileId
  const userId = api.profile.getUserIdByProfileId.useQuery({
    profile_id: profile_id,
  }).data;

  const {
    data: followersData,
    isLoading: followersLoading,
    error: followersError,
  } = api.follow.getFollowersList.useQuery({
    userId: userId || '',
  });

  return {
    followersData: followersData || [],
    followersLoading,
    followersError,
  };
};

//fetch following list
export const useFetchFollowing = () => {
  const profile_id = useRouterId();

  // Fetch userId using getUserIdByProfileId
  const userId = api.profile.getUserIdByProfileId.useQuery({
    profile_id: profile_id,
  }).data;

  const {
    data: followingData,
    isLoading: followingLoading,
    error: followingError,
  } = api.follow.getFollowingList.useQuery({
    userId: userId || '',
  });

  return {
    followingData: followingData || [],
    followingLoading,
    followingError,
  };
};

export const useFetchFollowStatus = (userId: string) => {
  const queryClient = useQueryClient();

  const followStatus = useQuery(
    ['getFollowStatus', userId], // The query key
    () => api.follow.getFollowStatus.useQuery({ userId }),
    {
      enabled: !!userId,
    }
  );

  const { data, isLoading, error } = followStatus;

  const refetch = async () => {
    try {
      await queryClient.invalidateQueries(['getFollowStatus', userId]);
    } catch (error) {
      console.error('Error refetching follow status:', error);
    }
  };

  return {
    isFollowing: data?.data?.isFollowing || false,
    isLoading,
    error,
    refetch,
  };
};



