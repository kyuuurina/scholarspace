//to-do: add PageLoader

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
import AvatarPlaceholder from "~/components/AvatarPlaceholder";
import { FaEdit } from 'react-icons/fa';
//import { DeleteProfileDetails } from "~/components/workspace/DeleteProfileDetails";
import SuccessToast from "~/components/toast/SuccessToast";
import ErrorToast from "~/components/toast/ErrorToast";
import Header from "~/components/workspace/Header";



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
  const id = useRouterId();
  const userId = getCookie("UserID");

  //const modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(true);

  //custom hooks
  const {name, about_me, skills,research_interest,isLoading,error} = useFetchProfile();
  const education = useFetchEducation();
  const experience = useFetchExperience();
  const achievement = useFetchAchievement();
  // const { title, start_year, end_date, description, isLoading} = useFetchExperience();
  // const { title, received_year, description, isLoading} = useFetchAchievement();


  const schema: ZodType<ProfileFormData> = z.object({
    name: z.string(),
    about_me: z.string().nullable(),
    skills: z.string().nullable(),
    research_interest: z.string().nullable(),
    collab_status: z.string(),
  });

  const updateProfile = api.profile.update.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Profile successfully updated" />);
      router.reload();
    },
    onError: () => {
      toast.custom(() => <ErrorToast message="Error updating profile" />);
    },
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
      // collab_status: collab_status,
    }
  });

  //set form value to profile data
  useEffect(() => {
    if (!isLoading) {
      setValue("name", name || "");
      setValue("about_me", about_me || "");
      setValue("skills", skills || "");
      setValue("research_interest", research_interest || "");
      // setValue("collab_status", collab_status || "");
    }
  }, [isLoading, setValue]);

  //handlers
  const handleUpdateProfile = async (formData: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        id: id as string,
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
      // collab_status: collab_status || "",
    });
  };

  // loader
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  const handleEditClick = () => {setIsEditModalOpen(true);};
  const handleEducationClick = () => {setIsEducationModalOpen(true);}

  return (
    <>
      {/* <Head title="Profile" /> */}
      {/* <PageLoader isLoading={isLoading} errorMsg={error?.message}> */}
        <ProfileTabs />

        <main className="min-h-screen w-full">
        <div className="p-5">
          {/* Profile section  */}
          <div className="grid gap-y-5">
            <section className="mt-2 w-full rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
              <div>
                Profile
              </div>
            </section>
          </div>

          {/* Education section  */}
          <div className="grid gap-y-5">
            <section className="mt-2 w-full rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
            <div>
                Education
              </div>
            </section>
          </div>

          {/* Experience section  */}
          <div className="grid gap-y-5">
            <section className="mt-2 w-full rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
            <div>
                Research Experience
              </div>
            </section>
          </div>

          {/* Achievement section  */}
          <div className="grid gap-y-5">
            <section className="mt-2 w-full rounded-sm border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
            <div>
                Achievement
              </div>
            </section>
          </div>
  
        </div>
      </main>

      {/* UserProfileForm modal */}
      {/* {isEditModalOpen && (
        <UserProfileForm
          openModal={isEditModalOpen}
          onClick={() => setIsEditModalOpen(false)}
        />
      )} */}

      {/* EducationForm modal
      {isEducationModalOpen && (
        <EducationForm
          openModal={isEducationModalOpen}
          onClick={() => setIsEducationModalOpen(false)}
        />
      )} */}

      {/* Experience modal
      {isExperienceModalOpen && (
        <ExperienceForm
          openModal={isExperienceModalOpen}
          onClick={() => setIsExperienceModalOpen(false)}
        />
      )} */}

      {/* Achievement modal
      {isAchievementModalOpen && (
        <AchievementForm
          openModal={isAchievementModalOpen}
          onClick={() => setIsAchievementModalOpen(false)}
        />
      )}       */}
      
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



// return (
//   <>
//     {/* <Head title={name} /> */}
//     {/* <PageLoader isLoading={isLoading} errorMsg={error?.message}> */}
//       <ProfileTabs />


//     {/* UserProfileForm modal */}
//     {isEditModalOpen && (
//       <UserProfileForm
//         openModal={isEditModalOpen}
//         onClick={() => setIsEditModalOpen(false)}
//       />
//     )}

//     {/* EducationForm modal */}
//     {isEducationModalOpen && (
//       <EducationForm
//         openModal={isEducationModalOpen}
//         onClick={() => setIsEducationModalOpen(false)}
//       />
//     )}

//     {/* Experience modal */}
//     {isExperienceModalOpen && (
//       <ExperienceForm
//         openModal={isExperienceModalOpen}
//         onClick={() => setIsExperienceModalOpen(false)}
//       />
//     )}

//     {/* Achievement modal */}
//     {isAchievementModalOpen && (
//       <AchievementForm
//         openModal={isAchievementModalOpen}
//         onClick={() => setIsAchievementModalOpen(false)}
//       />
//     )}      
//     {/* </PageLoader> */}
//   </>
// );
// };


