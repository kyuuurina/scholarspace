// src/utils/researchpost.ts
import { api } from "./api";
import { useRouterId } from "./routerId";

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
