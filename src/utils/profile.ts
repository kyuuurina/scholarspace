//add import in api.ts

import { api } from './api';
import { useRouterId } from './routerId';

type User = {
    userid: string;
    user: {
        name: string | null;
        email: string | null;
        avatar_url: string | null;
    };
};

// type Profile = {
//     profile_id: string;
//     user_id: string;
//     name: string;
//     about_me?: string | null;
//     skills?: string[] | null;
//     research_interest?: string[] | null;
//     collab_status?: 'Open_For_Collaboration' | 'Not_Open_For_Collaboration'; // enum values
// };

// type Education = {
//     education_id: string;
//     profile_id: string;
//     school_name: string;
//     start_date: Date;
//     end_date: Date;
// };

// type Experience = {
//     experience_id: string;
//     profile_id: string;
//     title: string;
//     start_date: Date;
//     end_date: Date;
// };

// type Achievement = {
//     achievement_id: string;
//     profile_id: string;
//     title: string;
//     received_date: Date;
// };

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


// //fetch education
// export const useFetchProfileEducation = () => {
//     const id: string = useRouterId();

//     const education = api.education.getProfileEducation.useQuery(
//         {
//             profile_id: id,
//         },
//         {
//             enabled: !!id,
//         }
//     );

//     const { isLoading, error, data } = education;

//     //store education in an array
//     const profileEducation: {
//         education_id: string;
//         profile_id: string;
//         school_name: string;
//         start_date: Date;
//         end_date: Date;
//     }[] = data || [];

//     return {
//         isLoading,
//         error,
//         profileEducation,
//     };

//     // return {
//     //     isLoading,
//     //     error,
//     //     data,
//     // };
// };



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