import { type } from 'os';
import {api} from './api';
import {useRouterId} from './routerId';

type Profile = {
    profile: {
        profile_id: string;
        user_id: string;
        name: string | null;
        about_me: string | null;
        collab_status: 'Open For Collaboration' | 'Not Open For Collaboration' | null;   //enum values
    }
}

// export const useFetchProfile = (profileId: string) => {
//     const profile = api.profile.getProfile.useQuery(
//         {
//             profile_id: profileId,
//         },
//         {
//             enabled: !!profileId,
//         }
//     );

//     const {profile_id, user_id, name, about_me, collab_status} = profile.data || {};

//     const {isLoading, error} = profile;

//     return {
//         profile: {profile_id, user_id, name, about_me, collab_status},
//         isLoading,
//         error,
//     };
// }




// import { api } from "./api";
// import { useRouterId } from "./routerId";

// type User = {
//   profile_id: string;
//   name: string;
//   collab_status: string;
//   // Add more properties as needed
// };

// export const useFetchUser = (userId: string) => {
//   const user = api.user.getUser.useQuery(
//     {
//       user_id: userId,
//     },
//     {
//       enabled: !!userId,
//     }
//   );

//   const { profile_id, name, collab_status } = user.data || {};

//   const { isLoading, error } = user;

//   return {
//     user: { profile_id, name, collab_status },
//     isLoading,
//     error,
//   };
// };