/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { api } from "./api";
import { useRouterId } from "./routerId";

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

    const { category, title, author, description, document } = researchpost.data || {};

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
    };
};



export const useFetchMyResearchPosts = () => {
    const id: string = useRouterId();

    const myResearchPosts = api.researchpost.getMyPosts.useQuery(
        {
            post_id: id,
        },
        {
            enabled: !!id,
        }
    );

    const { data, isLoading, error } = myResearchPosts;

    return {
        myResearchPosts: data || [],
        isLoading,
        error,
    };
};

export const useFetchFollowingResearchPosts = (limit = 20, cursor?: string) => {
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
    };
};


//hook for fetching user's research posts
// export const useFetchUserResearchPosts = (userId: string) => {
//     const userResearchPosts = api.researchpost.getMyPosts.useQuery(
//         {
//             user_id: userId,
//         },
//         {
//             enabled: !!userId,
//         }
//     );

//     return {
//         category,
//         title,
//         author,
//         description,
//         document,
//         isLoading,
//         error,
//         imgUrl,
//     };
// };






