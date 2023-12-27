//add import in api.ts

import { api } from './api';
import { useRouterId } from './routerId';

//fetch a user profile based on profile_id from router
export const useFetchProfile = () => {
    const id: string = useRouterId();

    const profile = api.profile.get.useQuery(
        {
            profile_id: id,
        },
        {
            enabled: !!id,
        }
    );


    const {
        profile_id,
        user_id,
        name,
        about_me,
        skills,
        research_interest,
        collab_status,
    } = profile.data || {};

    const { isLoading, error } = profile;

    return {
        name,
        about_me,
        skills,
        research_interest,
        collab_status,
        isLoading,
        error,
        profile_id,
        // profile_id: id,
        user_id,
    };
};