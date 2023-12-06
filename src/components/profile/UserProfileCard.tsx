//Display owner profile information in a card

import React from "react";
import useState from "react";
import useForm from "react-hook-form";
import { useRouter } from "next/router";
import { type ZodType, z, set} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { api } from "~/utils/api";
import Link from "next/link";
import Image from "next/image";
import AvatarPlaceholder from "../AvatarPlaceholder";

//types
import type { ProfileFormData } from "~/types/profile";

// local components
import FormErrorMessage from "../FormErrorMessage";
import PrimaryButton from "../button/PrimaryButton";

type UserProfileCardProps = {
    profile: ProfileFormData;
};

// type UserProfileCardProps = {
//     profile: {
//         name: string;
//         about_me?: string;
//         skills?: string;
//         collab_status?: string | null;
//     };
// };


const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-4 bg-white rounded-md shadow-md">
            <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
                <div className="flex items-center justify-center w-32 h-32">
                    <AvatarPlaceholder name={profile.name} shape = "circle" />
                </div>
                <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
                    <div className="text-2xl font-bold text-center text-gray-800">
                        {profile.name}
                    </div>
                    <div className="text-sm font-medium text-center text-gray-500">
                        {profile.about_me || "No description"}
                    </div>
                    <div className="text-sm font-medium text-center text-gray-500">
                        {profile.skills}
                    </div>
                    {/* <div className="text-sm font-medium text-center text-gray-500">
                        {profile.education}
                    </div> */}
                    <div className="text-sm font-medium text-center text-gray-500">
                        {profile.collab_status || null}
                    </div>
                </div>
            </div>
        </div>
    );
};

{/* <main className="min-h-screen w-full">
<div className="p-5">
  {/* Update Workspace Section  */}
//   <div className="grid gap-y-5">
//     <section className="mt-2 w-full rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
//       <form
//         className="space-y-6"
//         autoComplete="off"
//         onSubmit={handleSubmit(handleUpdateProfile)}
//       >
//         <h5 className="text-xl font-medium text-gray-900 dark:text-white">
//           General Settings
//         </h5>
//         <div>
//           <label
//             htmlFor="workspace-name"
//             className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
//           >
//             Name
//           </label>
//           <input className="w-full" {...register("name")} />
//           {errors.name && (
//             <FormErrorMessage text={errors.name.message} />
//           )}
//         </div>
//         <div>
//           <label
//             htmlFor="about_me"
//             className="mb-2 mt-4 block text-sm font-medium text-gray-900 dark:text-white"
//           >
//             About Me
//           </label>
//           <textarea className="w-full" {...register("about_me")} />
//           {errors.about_me && (
//             <FormErrorMessage text={errors.about_me.message} />
//           )}
//         </div>
//         <div className="flex justify-end space-x-3">
//           {isDirty && (
//             <button
//               type="button"
//               className="rounded-sm border border-gray-200 bg-white px-3 py-2 text-center text-sm font-medium hover:bg-grey-bg hover:text-purple-accent-1 focus:outline-none"
//               // reverts the input values to the original values
//               onClick={handleCancel}
//             >
//               Cancel
//             </button>
//           )}
//           <button
//             type="submit"
//             className={`${
//               isDirty
//                 ? "bg-purple-accent-1 hover:bg-purple-accent-2"
//                 : "bg-gray-200"
//             } rounded-sm px-3 py-2 text-center text-sm font-medium text-white focus:outline-none`}
//             disabled={!isDirty}
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </section>

//   </div>
// </div>
// </main> */}




