// src/utils/likedpost.ts
import { api } from "./api";
import { useRouterId } from "./routerId";

export const useFetchLikedPost = () => {
    const id: string = useRouterId();

    const likedpost = api.postlike.get.useQuery( 
        {
            like_id: id,
        },
        {
            enabled: !!id,
        }
    );


    const { data,isLoading, error } = likedpost;


    return {
        likedpost: data || [],
        isLoading,
        error,

    };
    console.log("utils useFetchLikedPost",likedpost);
};

// export const useFetchLikedPosts = () => {
//     const likedPosts = api.likeRouter.getMyLikedPosts.useQuery({}, { enabled: true });

//     const { data, isLoading, error } = likedPosts;

//     return {
//         likedPosts: data || [],
//         isLoading,
//         error,
//     };
// };
