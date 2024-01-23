import { api } from "./api";
import { useRouterId } from "./routerId";
import { useUser } from '@supabase/auth-helpers-react';

export const useFetchResearchPost = () => {
  const id: string = useRouterId();

  const researchpost = api.researchpost.get.useQuery(
    {
      post_id: id,
    },
    {
      enabled: !!id,
    }
  );

  const { category, title, author, description, document, created_at } =
    researchpost.data || {};

  const { isLoading, error } = researchpost;

  let fileUrl = "";
  if (document) {
    fileUrl = `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/post-files-upload/${document}`;
  }

  return {
    category,
    title,
    author,
    description,
    document,
    isLoading,
    error,
    fileUrl,
    created_at,
  };
};

//fetch my research posts
export const useFetchMyResearchPosts = (id: string) => {
  console.log("Dari depam", id);
  const myResearchPosts = api.researchpost.getMyPosts.useQuery(
    {
      post_id: id,
    },
    {
      enabled: !!id,
    }
  );

  const { data, isLoading, error } = myResearchPosts;
  console.log(myResearchPosts);
  return {
    myResearchPosts: data || [],
    isLoading,
    error,
  };
};

//fetch following posts
export const useFetchFollowingResearchPosts = (limit = 30, cursor?: string) => {
  const followingResearchPosts = api.researchpost.getFollowingPosts.useQuery(
    {
      limit,
      cursor,
    },
    {
      //`enabled: true` if to fetch data immediately.
      enabled: true,
    }
  );

  const { data, isLoading, error } = followingResearchPosts;

  return {
    followingResearchPosts: data?.researchPosts || [], // Corrected: Access the correct property
    isLoading,
    error,
    refetch: followingResearchPosts.refetch,
  };
};

//fetch recommendations:
export const useFetchPostRecommendations = () => {
  const {
    data: postRecommendations,
    isLoading: isLoadingPostRecommendations,
    error: errorPostRecommendations,
  } = api.researchpost.getResearchPostRecommendations.useQuery();

  return {
    postRecommendations: postRecommendations || [],
    isLoadingPostRecommendations,
    errorPostRecommendations,
  };
};


// Fetch research posts created by followed users
export const useFetchResearchPostsByFollowedUsers = () => {
  const {
    data: researchPostsByFollowedUsers,
    isLoading: isLoadingResearchPostsByFollowedUsers,
    error: errorResearchPostsByFollowedUsers,
  } = api.researchpost.getResearchPostsByFollowedUsers.useQuery();

  return {
    researchPostsByFollowedUsers: researchPostsByFollowedUsers || [],
    isLoadingResearchPostsByFollowedUsers,
    errorResearchPostsByFollowedUsers,
  };
};


// export const useFetchLikedPost = (id: string) => {
//   const {
//     data: myLikedPosts,
//     isLoading: isLoadingLikedpost,
//     error: errorLikedpost }
//     = api.researchpost.getLikedPostsByUser.useQuery();

//   return {
//     myLikedPosts: myLikedPosts || [],
//     isLoadingLikedpost,
//     errorLikedpost,
//   };
// };

export const useFetchLikedPost = (user_id: string) => {
  const {
    data: myLikedPosts,
    isLoading: isLoadingLikedpost,
    error: errorLikedpost,
  } = api.researchpost.getLikedPostsByUser.useQuery(
    {
      user_id: user_id,
    },
    {
      enabled: !!user_id,
    }
  );

  return {
    myLikedPosts: myLikedPosts || [],
    isLoadingLikedpost,
    errorLikedpost,
  };
};
