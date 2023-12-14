//to-do: add PageLoader
//this file contains dummy data for Education, Research Experience and Achievement

import React from 'react';
import {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {api} from "~/utils/api";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";
import Image from 'next/image';
import Link from 'next/link';

//utils
import { useRouterId } from "~/utils/routerId";
import { useFetchProfile } from "~/utils/profile";
import { useFetchEducation } from '~/utils/education';
import { useFetchExperience } from '~/utils/experience';
import { useFetchAchievement } from '~/utils/achievement';

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import type { ProfileFormData, EducationFormData, AchievementFormData, ExperienceFormData } from '~/types/profile';

//local components
import Layout from "~/components/layout/Layout";
import Head from 'next/head';
import FormErrorMessage from "~/components/FormErrorMessage";
import PageLoader from "~/components/layout/PageLoader";
import ErrorPage from "~/pages/error-page";
import LoadingSpinner from "~/components/LoadingSpinner";
import PrimaryButton from "~/components/button/PrimaryButton";
import AvatarPlaceholder from "~/components/avatar/AvatarPlaceholder";
import { FaEdit } from 'react-icons/fa';
//import { DeleteProfileDetails } from "~/components/workspace/DeleteProfileDetails";
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";


//profile components
import ProfileTabs from '~/components/profile/ProfileTabs';
import UserProfileCard from "~/components/profile/UserProfileCard";
import UserProfileForm from "~/components/profile/UserProfileForm";
import EducationForm from "~/components/profile/EducationForm";
import EducationCard from "~/components/profile/EducationCard";
import ExperienceForm from "~/components/profile/ExperienceForm";
//import ExperienceCard from "~/components/profile/ExperienceCard";
import AchievementForm from "~/components/profile/AchievementForm";
// import AchievementCard from "~/components/profile/AchievementCard";


const ProfilePage: NextPageWithLayout = () => {

  //const
  const router = useRouter();
  const {id}  = router.query;           //query id
  // const profile_id = useRouterId();
  const userId = getCookie("UserID");

  const {name, about_me, skills,research_interest, collab_status, isLoading} = useFetchProfile();
  //const modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

  //schema for form validation
  const schema: ZodType<ProfileFormData> = z.object({
    name: z.string(),
    about_me: z.string().nullable(),
    skills: z.string().nullable(),
    research_interest: z.string().nullable(),
    collab_status: z.string(),
  });

    //react-hook-form
    const {
      register,
      handleSubmit,
      setValue,
      reset,
      formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
      resolver: zodResolver(schema),
      defaultValues :{
        name: name,
        about_me: about_me,
        skills: skills,
        research_interest: research_interest,
        collab_status: collab_status,
      }
    });

        //set form value to profile data
        useEffect(() => {
          if (!isLoading) {
            setValue("name", name || "");
            setValue("about_me", about_me || "");
            setValue("skills", skills || "");
            setValue("research_interest", research_interest || "");
            setValue("collab_status", collab_status || "");
    
          }
        }, [isLoading, setValue]);
    
      //toast
      const updateProfile = api.profile.updateProfile.useMutation({
        onSuccess: () => {
          toast.custom(() => <SuccessToast message="Profile successfully updated" />);
          router.reload();
        },
        onError: () => {
          toast.custom(() => <ErrorToast message="Error updating profile" />);
        },
      });
    
      //handlers
      const handleUpdateProfile = async (formData: ProfileFormData) => {
        try {
          await updateProfile.mutateAsync({
            // profile_id,
            profile_id: id as string,     //pass the id to router.query
            // profile_id: id,
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

  const handleEditClick = () => {setIsEditModalOpen(true);};

  return (
    <>
      {/* <Head title="Profile" /> */}
      {/* <PageLoader isLoading={isLoading} errorMsg={error?.message}> */}
        <ProfileTabs />

        <main className="min-h-screen w-full">
        <div className="p-5">
          <div className="grid gap-y-5">

            {/* User Profile Card */}
            <section className="mt-2 w-3/4 mx-auto rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-2xl">Profile</h3>
                <div>
                  <button onClick={handleEditClick} className="flex items-center">
                    Edit <FaEdit className="ml-2" />
                  </button>

                </div>
              </div>
              <div>
                {/* Render UserProfileForm if isEditModalOpen is true */}
                {isEditModalOpen && (
                  <UserProfileForm
                    openModal={isEditModalOpen}
                    onClick={() => setIsEditModalOpen(false)}
                  />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              </div>

              </div>
              <div> 
              </div>
            </section>

            {/* Education section */}
            <section className="mt-2 w-3/4 mx-auto rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
              <h3 className="font-semibold text-2xl mb-4">
                Education
              </h3>
              
              <div className="mb-4">
                {/* Year */}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Year:</span> 2020 - 2023
                </p>

                {/* Institution Name */}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Institution:</span> Universiti Malaya
                </p>

                {/* Description */}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Description:</span> Software Engineering.
                </p>
              </div>

              {/* Add Education Button on the right side */}
              <button
                onClick={() => setIsEducationModalOpen(true)}
                className="bg-purple-700 text-white px-4 py-2 rounded-md"
              >
                Add New
              </button>
            </section>
            {/* Render EducationForm passing modal state and onClose handler */}
              <EducationForm
                openModal={isEducationModalOpen}
                onClick={() => setIsEducationModalOpen(false)}
              />
          </div>

          {/* Experience section  */}
          <div className="grid gap-y-5">
          <section className="mt-2 w-3/4 mx-auto rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
              <h3 className="font-semibold text-2xl mb-4">
                Research Experience
              </h3>
              
              <div className="mb-4">
                {/* Year */}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Year:</span> 2015 - 2016
                </p>

                {/* Institution Name */}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Title:</span> Nursing at Hospital Kuala Lumpur
                </p>

                {/* Description */}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Description:</span> Research Assistant
                </p>
              </div>
              {/* Add Education Button on the right side */}
                <button
                  onClick={() => setIsExperienceModalOpen(true)}
                  className="bg-purple-700 text-white px-4 py-2 rounded-md mt-4"
                >
                  Add New
                </button>
            </section>
            {/* Render ExperienceForm passing modal state and onClose handler */}
                <ExperienceForm
                openModal={isExperienceModalOpen}
                onClick={() => setIsExperienceModalOpen(false)}
              />
          </div>

          {/* Experience section  */}
          <div className="grid gap-y-5">
          <section className="mt-2 w-3/4 mx-auto rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
              <h3 className="font-semibold text-2xl mb-4">
                Achievement
              </h3>
              
              <div className="mb-4">
                {/* Year */}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Year:</span> 2018
                </p>

                {/* Institution Name */}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Title:</span> Dean List Award
                </p>

                {/* Description */}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Description:</span> FCSIT Deans List
                </p>
              </div>
              {/* Add Education Button on the right side */}
                <button
                  onClick={() => setIsAchievementModalOpen(true)}
                  className="bg-purple-700 text-white px-4 py-2 rounded-md mt-4"
                >
                  Add New
                </button>
            </section>
            {/* Render ExperienceForm passing modal state and onClose handler */}
                <AchievementForm
                openModal={isAchievementModalOpen}
                onClick={() => setIsAchievementModalOpen(false)}
              />
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



                {/* Render UserProfileCard passing profile object */}
                {/* {profile && (
                  <UserProfileCard
                    key={profile.profile_id}
                    profile={profile}
                  />
                )} */}