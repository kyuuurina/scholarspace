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

    let imgUrl = "";
    if (document) {
        imgUrl = `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/post-files-upload/${document}`;
    }

    return {
        category,
        title,
        author,
        description,
        document,
        isLoading,
        error,
        imgUrl,
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







