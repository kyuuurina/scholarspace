//add import in api.ts

import { api } from './api';
import { useRouterId } from './routerId';

type Profile = {
    profile_id: string;
    user_id: string;
    name: string;
    about_me: string | null;
    skills: string | null;
    research_interest: string | null;
    collab_status: string;
};

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


//Step 2

// import { api } from "./api";
// import { useRouterId } from "./routerId";

// export const useFetchResearchPost = () => {
//     const id: string = useRouterId();

//     const researchpost = api.researchpost.get.useQuery(
//         {
//             post_id: id,
//         },
//         {
//             enabled: !!id,
//         }
//     );

//     const { category, title, author, description, document } = researchpost.data || {};

//     const { isLoading, error } = researchpost;

//     let imgUrl = "";
//     if (document) {
//         imgUrl = `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/post-files-upload/${document}`;
//     }

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