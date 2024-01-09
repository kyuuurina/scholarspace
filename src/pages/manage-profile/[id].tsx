
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

// Auth
import { getCookie } from "cookies-next";

// utils
import { useRouterId } from "~/utils/routerId";
import { useFetchProfile, UseCheckProfile } from "~/utils/profile";
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
import FollowersList from '~/components/network/FollowerList';
import FollowingList from '~/components/network/FollowingList';



const ProfilePage: NextPageWithLayout = () => {

  const router = useRouter();
  const { id }  = router.query; // query id

  const profileId = useRouterId();

  // get user profile
  const Profile = api.profile.get.useQuery({
    profile_id: profileId, // pass the id to router.query
  });

  //check id is owner
  const userId = getCookie("UserID") as string;
  const { user } = UseCheckProfile(userId);
  const isOwner = user && user.id === Profile.data?.user_id; // check if the logged in user matches Profile user
  const isNotOwner = !user || (user && user.id !== Profile.data?.user_id);    //not owner


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


  // const modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);


  // Add this console.log to check the profile data
  console.log('Profile Data:', useFetchProfile());
  console.log('Edu', useFetchEducation());
  console.log('Router Query:', router.query);

  const handleEditClick = () => { setIsEditModalOpen(true); };

  return (
    <>
      <Head>
        <title>{`${name ?? 'User'}'s Profile`}</title>
      </Head>
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
                {isOwner && (
                  <button onClick={handleEditClick} className="flex items-center">
                    Edit <FaEdit className="ml-2" />
                  </button>
                )}
                </div>

                <div>
                  {/* Follow Button */}
                  {isNotOwner && user_id && (
                    <FollowButton userId={user_id} />
                  )}
                </div>
                <div className="flex space-x-4">
                  {/*  */}
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
                  <div className="flex space-x-4">
                    <div className="mb-4">
                      <FollowersList />
                    </div>
                    <div className="mb-4">
                      <FollowingList />
                    </div>
                  </div>
                  <div className="mt-4 mb-4">
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
                    {research_interest && (
                      <TagList tags={research_interest.split(',').map((tag) => tag.trim())} />
                    )}
                  </div>
                </div>
              </div>
              <div>{/* Following Modal */}</div>
            </section>
  
            <section className="mt-2 w-3/4 mx-auto rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
              <h3 className="font-semibold text-2xl mb-4">
                Education
                {isOwner && (
                <button
                  className="ml-2 text-blue-500 cursor-pointer"
                  onClick={() => setIsEducationModalOpen(true)}
                >
                  <FaPlus />
                </button>
                )}
              </h3>
              {EducationLoading ? (
                  <LoadingSpinner />
                ) : educations && educations.length > 0 ? (
                  educations.map((education) => (
                    <EducationCard key={education.education_id} education={{...education, isLoading: false}} />
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
                  {isOwner && (
                  <button
                    className="ml-2 text-blue-500 cursor-pointer"
                    onClick={() => setIsExperienceModalOpen(true)}
                  >
                    <FaPlus />
                  </button>
                  )}
                </h3>
                {ExperienceLoading ? (
                  <LoadingSpinner />
                ) : experiences && experiences.length > 0 ? (
                  experiences.map((experience) => (
                    <ExperienceCard key={experience.experience_id} experience={{...experience, isLoading: false}} />
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
                    {isOwner && (
                    <button
                      className="ml-2 text-blue-500 cursor-pointer"
                      onClick={() => setIsAchievementModalOpen(true)}
                    >
                      <FaPlus />
                    </button>
                    )}
                  </h3>
                  {AchievementLoading ? (
                  <LoadingSpinner />
                ) : achievements && achievements.length > 0 ? (
                  achievements.map((achievement) => (
                    <AchievementCard key={achievement.achievement_id} achievement={{...achievement, isLoading: false}} />
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
