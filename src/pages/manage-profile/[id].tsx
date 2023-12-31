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
import { FaPlus } from 'react-icons/fa';

// utils
import { useRouterId } from "~/utils/routerId";
import { useFetchProfile } from "~/utils/profile";
import { useFetchEducation } from '~/utils/education';
import { useFetchExperience } from '~/utils/experience';
import { useFetchAchievement } from '~/utils/achievement';
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
import ExperienceCard from "~/components/profile/ExperienceCard";
import AchievementForm from "~/components/profile/AchievementForm";
import AchievementCard from "~/components/profile/AchievementCard";

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
  // const { educations: educationsData, isLoading: isLoadingEducations } = useFetchEducation();
  const { educations, isLoading: EducationLoading, error: EducationError } = useFetchEducation();
  const { achievements, isLoading: AchievementLoading, error: AchievementError } = useFetchAchievement();
  const { experiences, isLoading: ExperienceLoading, error: ExperienceError } = useFetchExperience();

  // const myEducationLists = useFetchTry();
  // console.log("myEducationLists:", myEducationLists);


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
  


  // Add this console.log to check the profile data
  console.log('Profile Data:', useFetchProfile());
  console.log('Edu', useFetchEducation());
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
              {/* <div className="relative w-20 h-20">
                  <Image
                    src={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/avatar/${avatar_url}`}
                    alt="User Avatar"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div> */}
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
                  </div>
                </div>
              </div>
              <div>
              {/* Following Modal */}
              </div>
            </section>
  
            <section className="mt-2 w-3/4 mx-auto rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
              <h3 className="font-semibold text-2xl mb-4">
                Education
                <button
                  className="ml-2 text-blue-500 cursor-pointer"
                  onClick={() => setIsEducationModalOpen(true)}
                >
                  <FaPlus />
                </button>
              </h3>
              {educations ? (
                educations.map((education) => (
                  <EducationCard key={education.education_id} education={education} />
                ))
              ) : (
                <div>No education data available</div>
              )}
              {isEducationModalOpen && (
                <EducationForm
                  openModal={isEducationModalOpen}
                  onClick={() => setIsEducationModalOpen(false)}
                />
              )}
            </section>
  
            {/* Experience section */}
            <div className="grid gap-y-5">
              {/* Research Experience section */}
              <section className="mt-2 w-3/4 mx-auto rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
                <h3 className="font-semibold text-2xl mb-4">
                  Research Experience
                  <button
                    className="ml-2 text-blue-500 cursor-pointer"
                    onClick={() => setIsExperienceModalOpen(true)}
                  >
                    <FaPlus />
                  </button>
                </h3>
                {experiences ? (
                  experiences.map((experience) => (
                    <ExperienceCard key={experience.experience_id} experience={experience} />
                  ))
                ) : (
                  <div>No experience data available</div>
                )}
                {isExperienceModalOpen && (
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
                    <button
                      className="ml-2 text-blue-500 cursor-pointer"
                      onClick={() => setIsAchievementModalOpen(true)}
                    >
                      <FaPlus />
                    </button>
                  </h3>
                  {achievements ? (
                    achievements.map((achievement) => (
                      <AchievementCard key={achievement.achievement_id} achievement={achievement} />
                    ))
                  ) : (
                    <div>No achievement data available</div>
                  )}
                  {isAchievementModalOpen && (
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
