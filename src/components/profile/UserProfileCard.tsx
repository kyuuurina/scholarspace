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
import AvatarPlaceholder from "../AvatarPlaceholder";

//types
import type { ProfileFormData } from "~/types/profile";

// local components
import FormErrorMessage from "../FormErrorMessage";
import PrimaryButton from "../button/PrimaryButton";

type UserProfileCardProps = {
    profile: ProfileFormData;
};

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
                        {profile.about_me}
                    </div>
                </div>
            </div>
        </div>
    );
};




