//Query all post created by user, if null, display "You have not created any post yet"

import React from 'react';
import {useState} from 'react';
import {api} from "~/utils/api";
import Image from 'next/image';
import Link from 'next/link';

//utils
import { useRouterId } from "~/utils/routerId";
import { useFetchResearchPost, useFetchUserResearchPosts } from '~/utils/researchpost';

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

import ErrorPage from "~/pages/error-page";
//local components
import Layout from "~/components/layout/Layout";
import PageLoader from "~/components/layout/PageLoader";
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
import Head from 'next/head';


const MyPost: NextPageWithLayout = () => {
  const id = useRouterId();
  const researchPosts = useFetchResearchPost();
  // const userResearchPosts = useFetchUserResearchPost();


  // const {
  //   name,
  //   about_me,
  //   skills,
  //   research_interest,
  //   isLoading,
  //   error
  // } = useFetchProfile();

  return (
    <>
      {/* <Head title={name} /> */}
      {/* <PageLoader isLoading={isLoading} errorMsg={error?.message}> */}
      <ProfileTabs />
      {/* </PageLoader> */}
    </>
  );
};

MyPost.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default MyPost;
