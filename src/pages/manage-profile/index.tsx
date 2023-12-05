//to-do: add PageLoader

import React from 'react';
import {useState} from 'react';
import {api} from "~/utils/api";
import Image from 'next/image';
import Link from 'next/link';

//utils
import { useRouterId } from "~/utils/routerId";
import { useFetchProfile } from "~/utils/profile";
import { useFetchEducation } from '~/utils/education';

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";


//local components
import Layout from "~/components/layout/Layout";
import Head from 'next/head';
import PageLoader from "~/components/layout/PageLoader";
import ErrorPage from "~/pages/error-page";
import LoadingSpinner from "~/components/LoadingSpinner";
import PrimaryButton from "~/components/button/PrimaryButton";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";
import { FaEdit } from 'react-icons/fa';

//profile components
import ProfileTabs from '~/components/profile/ProfileTabs';
import UserProfileCard from "~/components/research-post/UserRecCards";
import UserProfileForm from "~/components/profile/UserProfileForm";
import EducationForm from "~/components/profile/EducationForm";
import EducationCard from "~/components/profile/EducationCard";
import ExperienceForm from "~/components/profile/ExperienceForm";
//import ExperienceCard from "~/components/profile/ExperienceCard";
import AchievementForm from "~/components/profile/AchievementForm";
// import AchievementCard from "~/components/profile/AchievementCard";



const ProfilePage: NextPageWithLayout = () => {
  const id = useRouterId();
  const {name, about_me, skills,research_interest,isLoading,error} = useFetchProfile();

  useFetchEducation();



  //modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);


  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEducationClick = () => {
    setIsEducationModalOpen(true);
  }

  //const { educations } = useFetchEducation();

  return (
    <>
      {/* <Head title={name} /> */}
      {/* <PageLoader isLoading={isLoading} errorMsg={error?.message}> */}
        <ProfileTabs />


      {/* UserProfileForm modal */}
      {isEditModalOpen && (
        <UserProfileForm
          openModal={isEditModalOpen}
          onClick={() => setIsEditModalOpen(false)}
        />
      )}

      {/* EducationForm modal */}
      {isEducationModalOpen && (
        <EducationForm
          openModal={isEducationModalOpen}
          onClick={() => setIsEducationModalOpen(false)}
        />
      )}

      {/* Experience modal */}
      {isExperienceModalOpen && (
        <ExperienceForm
          openModal={isExperienceModalOpen}
          onClick={() => setIsExperienceModalOpen(false)}
        />
      )}

      {/* Achievement modal */}
      {isAchievementModalOpen && (
        <AchievementForm
          openModal={isAchievementModalOpen}
          onClick={() => setIsAchievementModalOpen(false)}
        />
      )}      
      {/* </PageLoader> */}
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

