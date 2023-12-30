/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// to-do: add PageLoader
// this file contains dummy data for Education, Research Experience, and Achievement

import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Image from 'next/image';
import Link from 'next/link';

// utils
import { useRouterId } from "~/utils/routerId";
import { useFetchProfile } from "~/utils/profile";
import { useFetchEducation } from '~/utils/education';
import { useFetchExperience } from '~/utils/experience';
import { useFetchAchievement } from '~/utils/achievement';
import { useFetchTry } from '~/utils/dummy';
import { useFetchFollowers } from '~/utils/follow';
import { useFetchFollowing } from '~/utils/follow';

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import type { ProfileFormData, EducationFormData, AchievementFormData, ExperienceFormData } from '~/types/profile';

// local components
import Layout from "~/components/layout/Layout";
import Head from 'next/head';
import FormErrorMessage from "~/components/FormErrorMessage";
import PageLoader from "~/components/layout/PageLoader";
import ErrorPage from "~/pages/error-page";
import LoadingSpinner from "~/components/LoadingSpinner";
import PrimaryButton from "~/components/button/PrimaryButton";
import AvatarPlaceholder from "~/components/avatar/AvatarPlaceholder";
import { FaEdit } from 'react-icons/fa';
// import { DeleteProfileDetails } from "~/components/workspace/DeleteProfileDetails";
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";
import TagList from '~/components/profile/TagList';
import CollabStatusBadge from '~/components/profile/CollabStatusBadge';

// profile components
import ProfileTabs from '~/components/profile/ProfileTabs';
import UserProfileForm from "~/components/profile/UserProfileForm";
import EducationForm from "~/components/profile/EducationForm";
import EducationCard from "~/components/profile/EducationCard";
import ExperienceForm from "~/components/profile/ExperienceForm";
// import ExperienceCard from "~/components/profile/ExperienceCard";
import AchievementForm from "~/components/profile/AchievementForm";
// import AchievementCard from "~/components/profile/AchievementCard";

// network component
import FollowButton from '~/components/network/FollowButton';
import Button from '~/components/button/Button';
import FollowListModal from '~/components/network/FollowListModal';


const ProfilePage: NextPageWithLayout = () => {

  const router = useRouter();
  const { id }  = router.query; // query id

  const profileId = useRouterId();

  // get user profile
  const Profile = api.profile.get.useQuery({
    profile_id: profileId, // pass the id to router.query
  });

  const { avatar_url, name, about_me, skills, research_interest, collab_status, isLoading, user_id } = useFetchProfile();
  const myEducationLists = useFetchTry();
  console.log("myEducationLists:", myEducationLists);


  // Fetch Followers and Following data
  // const followers = api.follow.getFollowersList.useQuery({
  //   userId: profileId, // pass the user's id
  // });

  // const following = api.follow.getFollowingList.useQuery({
  //   userId: profileId, // pass the user's id
  // });

  // Fetch Followers and Following data
  const { followers, isLoading: isLoadingFollowers } = useFetchFollowers();
  const { following, isLoading: isLoadingFollowing } = useFetchFollowing();

  // const modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

  // state for Followers and Following modals
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  
  

  // schema for form validation
  const schema: ZodType<ProfileFormData> = z.object({
    avatar_url: z.string().nullable(),
    name: z.string(),
    about_me: z.string().nullable(),
    skills: z.string().nullable(),
    research_interest: z.string().nullable(),
    collab_status: z.string(),
  });

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues :{
      avatar_url: avatar_url,
      name: name,
      about_me: about_me,
      skills: skills,
      research_interest: research_interest,
      collab_status: collab_status,
    }
  });

  // set form value to profile data
  useEffect(() => {
    if (!isLoading) {
      setValue("avatar_url", Profile.data?.avatar_url || "");
      setValue("name", name || "");
      setValue("about_me", about_me || "");
      setValue("skills", skills || "");
      setValue("research_interest", research_interest || "");
      setValue("collab_status", collab_status || "");
    }
  }, [isLoading, setValue]);

  // toast
  const updateProfile = api.profile.updateProfile.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Profile successfully updated" />);
      router.reload();
    },
    onError: () => {
      toast.custom(() => <ErrorToast message="Error updating profile" />);
    },
  });

  // handlers
  const handleUpdateProfile = async (formData: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        profile_id: id as string, // pass the id to router.query
        ...formData,
      });
      console.log(formData);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  // handle cancel
  const handleCancel = () => {
    reset({
      name: name || "",
      about_me: about_me || "",
      skills: skills || "",
      research_interest: research_interest || "",
      collab_status: collab_status || "",
    });
  };

  // Add this console.log to check the profile data
  console.log('Profile Data:', useFetchProfile());
  console.log('Router Query:', router.query);

  const handleEditClick = () => { setIsEditModalOpen(true); };

  return (
    <>
      <ProfileTabs />
  
      <main className="min-h-screen w-full">
        <div className="p-5">
          <div className="grid gap-y-5">
            {/* User Profile Card */}
            <section className="mt-2 w-3/4 mx-auto rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
              <div className="flex justify-between items-center">
              <h3 className="font-semibold text-2xl mb-4">{`${name ?? 'User'}'s Profile`}</h3>
                <div>
                  <button onClick={handleEditClick} className="flex items-center">
                    Edit <FaEdit className="ml-2" />
                  </button>
                  {/* Follow button */}
                  {/* <FollowButton userId={id as string} /> */}
                </div>
                <div>
                  <Button name="Followers" onClick={() => setIsFollowersModalOpen(true)} />
                </div>
                <div>
                  <Button name="Following" onClick={() => setIsFollowersModalOpen(true)} />
                </div>
              </div>
              <div>
                {isEditModalOpen && (
                  <UserProfileForm
                    openModal={isEditModalOpen}
                    onClick={() => setIsEditModalOpen(false)}
                  />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* ... */}
                </div>
                <div>
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <CollabStatusBadge collabStatus={collab_status} />
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-base font-bold text-black mb-2">About Me:</p>
                    <p className="text-sm text-gray-600">{about_me}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-base font-bold text-black mb-2">Skills:</p>
                    <p className="text-sm text-gray-600">
                      {skills && <TagList tags={skills.split(',').map((tag) => tag.trim())} />}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-base font-bold text-black mb-2">Research Interest:</p>
                    {research_interest && <TagList tags={research_interest.split(',').map((tag) => tag.trim())} />}
                    <p className="text-sm text-gray-600">{research_interest}</p>
                  </div>
                </div>
              </div>
              <div>
              {/* Following Modal */}
              </div>
            </section>
  
            {/* Education section */}
            <section className="mt-2 w-3/4 mx-auto rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
              <h3 className="font-semibold text-2xl mb-4">
                Education
              </h3>
              <ul className="grid grid-cols-1 gap-8">
                {myEducationLists.myEducations.map((education) => (
                  <li key={education.education_id} className="mb-8">
                    <EducationCard education={education} />
                  </li>
                ))}
              </ul>
              {isEditModalOpen && (
                <EducationForm
                  openModal={isEducationModalOpen}
                  onClick={() => setIsEducationModalOpen(false)}
                />
              )}
            </section>
  
            {/* Experience section */}
            <div className="grid gap-y-5">
              <section className="mt-2 w-3/4 mx-auto rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
                <h3 className="font-semibold text-2xl mb-4">
                  Research Experience
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Year:</span> 2015 - 2016
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Title:</span> Nursing at Hospital Kuala Lumpur
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Description:</span> Research Assistant
                  </p>
                </div>
                {isEditModalOpen && (
                  <ExperienceForm
                    openModal={isExperienceModalOpen}
                    onClick={() => setIsExperienceModalOpen(false)}
                  />
                )}
              </section>
  
              {/* Achievement section */}
              <div className="grid gap-y-5">
                <section className="mt-2 w-3/4 mx-auto rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
                  <h3 className="font-semibold text-2xl mb-4">
                    Achievement
                  </h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Year:</span> 2018
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Title:</span> Dean List Award
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Description:</span> FCSIT Deans List
                    </p>
                  </div>
                  {isEditModalOpen && (
                    <AchievementForm
                      openModal={isAchievementModalOpen}
                      onClick={() => setIsAchievementModalOpen(false)}
                    />
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default ProfilePage;
