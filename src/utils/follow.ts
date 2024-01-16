import { api } from "./api";
import {useRouterId} from "./routerId";
import {useQuery, useQueryClient} from "@tanstack/react-query";

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

export const useFetchFollowers = (userId: string) => {
  const {
    data: followersData,
    isLoading: followersLoading,
    error: followersError,
  } = api.follow.getFollowersList.useQuery({
    userId,
  });

  return {
    followersData: followersData || [], // Assuming the structure of the response
    followersLoading,
    followersError,
  };
};

//fetch following list
export const useFetchFollowing = (userId: string) => {
  const {
    data: followingData,
    isLoading: followingLoading,
    error: followingError,
  } = api.follow.getFollowingList.useQuery({
    userId,
  });

  return {
    followingData: followingData || [], // Assuming the structure of the response
    followingLoading,
    followingError,
  };
};



// export const useFetchFollowStatus = (userId: string) => {
//   const followStatus = api.follow.getFollowStatus.useQuery(
//     {
//       userId,
//     },
//     {
//       enabled: !!userId,
//     }
//   );

//   const { data, isLoading, error } = followStatus;

//   return {
//     isFollowing: data?.isFollowing || false,
//     isLoading,
//     error,
//   };
// };


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



