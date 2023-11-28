/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { api } from './api';
import { useRouterId } from './routerId';

type User = {
    user: {
        id: string;
        name: string | null;
    };
};

type Profile = {
    profile_id: string;
    user_id: string;
    name: string;
    about_me?: string | null;
    skills?: string[] | null;
    research_interest?: string[] | null;
    collab_status?: 'Open_For_Collaboration' | 'Not_Open_For_Collaboration'; // enum values
};

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
        user_id,
    };
};


// import { api } from './api';
// import { useRouterId } from './routerId';

// type User = {
//     user: {
//         id: string;
//         name: string | null;
//     }
// }

// type Profile = {
//     profile_id: string;
//     user_id: string;
//     name: string;
//     about_me?: string | null;
//     skills?: string[] | null;
//     research_interest?: string[] | null;
//     collab_status?: 'Open_For_Collaboration' | 'Not_Open_For_Collaboration' | null;   //enum values

// }

// export const useFetchProfile = () => {
//     const id: string = useRouterId();

//     const profile = api.profile.get.useQuery(
//         {
//             profile_id: id,
//         },
//         {
//             enabled: !!id,
//         }
//     );

//     const {
//         profile_id,
//         user_id,
//         name,
//         about_me,
//         skills,
//         research_interest,
//         collab_status,
//     } = profile.data || {};

//     const { isLoading, error } = profile;

//     return {
//         name,
//         about_me,
//         skills,
//         research_interest,
//         collab_status,
//         isLoading,
//         error,
//         profile_id,
//         user_id,
//     };
//     };
//     )
// };



//new

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