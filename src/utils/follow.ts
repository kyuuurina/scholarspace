import { api } from "./api";
import {useRouterId} from "./routerId";

export const useFetchFollowers = (id:string) => {

  const followers = api.follow.getFollowersList.useQuery(
    {
      userId: id,
    },
    {
      enabled: !!id,
    }
  );

  const { data, isLoading, error } = followers;

  return {
    followers: data || [],
    isLoading,
    error,
  };
};

export const useFetchFollowing = () => {
  const id: string = useRouterId();

  const following = api.follow.getFollowingList.useQuery(
    {
      userId: id,
    },
    {
      enabled: !!id,
    }
  );

  const { data, isLoading, error } = following;

  return {
    following: data || [],
    isLoading,
    error,
  };
};

export const useFetchFollowStatus = (userId: string) => {
  const followStatus = api.follow.getFollowStatus.useQuery(
    {
      userId,
    },
    {
      enabled: !!userId,
    }
  );

  const { data, isLoading, error } = followStatus;

  return {
    isFollowing: data?.isFollowing || false,
    isLoading,
    error,
  };
};

// export const useFetchFollowers = () => {
//     const id: string = useRouterId();

//     const followers = api.follow.getFollowers.useQuery(
//         {
//             profile_id: id,
//         },
//         {
//             enabled: !!id,
//         }
//     );

//     const { data, isLoading, error } = followers;

//     return {
//         followers: data || [],
//         isLoading,
//         error,
//     };



// export const followUser = async (targetUserId: string): Promise<boolean> => {
//   try {
//     // Call the follow procedure from your API
//     const result = await api.follow.follow.mutation({
//       input: { targetUserId },
//     });

//     // Return the result
//     return result;
//   } catch (error) {
//     // Handle errors, log, or throw as needed
//     console.error("Error following user:", error);
//     throw error;
//   }
// };

// export const unfollowUser = async (targetUserId: string): Promise<boolean> => {
//   try {
//     // Call the unfollow procedure from your API
//     const result = await api.follow.unfollow.mutation({
//       input: { targetUserId },
//     });

//     // Return the result
//     return result;
//   } catch (error) {
//     // Handle errors, log, or throw as needed
//     console.error("Error unfollowing user:", error);
//     throw error;
//   }
// };



// import { api } from "./api";
// import { useRouterId } from "./routerId";

// type FollowData = {
//   isFollowing: boolean;
//   followerCount: number;
//   targetUserId: string;
//   targetUserName: string;
//   targetUserAvatar: string | null;
// };

// export const useFetchFollow = (targetUserId: string) => {
//   const userId: string = useRouterId();

//   // Adjust the query function based on your actual API structure
//   const follow = api.follow.mutation({
//     targetUserId,
//   });

//   const { isFollowing, followerCount, targetUserId: targetUserIdFromData, targetUserName, targetUserAvatar } =
//     follow.data || {};

//   const { isLoading, error } = follow;

//   return {
//     isFollowing,
//     followerCount,
//     targetUserId: targetUserIdFromData,
//     targetUserName,
//     targetUserAvatar,
//     isLoading,
//     error,
//   };
// };

// export const useFollowUser = (targetUserId: string) => {
//   const userId: string = useRouterId();

//   const { mutate: followUser, ...followMutation } = api.follow.followMutation();

//   const follow = () => {
//     followUser({ targetUserId });
//   };

//   return {
//     follow,
//     ...followMutation,
//   };
// };

// export const useUnfollowUser = (targetUserId: string) => {
//   const userId: string = useRouterId();

//   const { mutate: unfollowUser, ...unfollowMutation } = api.follow.unfollowMutation();

//   const unfollow = () => {
//     unfollowUser({ targetUserId });
//   };

//   return {
//     unfollow,
//     ...unfollowMutation,
//   };
// };
