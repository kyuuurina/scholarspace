//to-do: add PageLoader

import React from 'react';
import {useState} from 'react';
import {api} from "~/utils/api";
import Image from 'next/image';
import Link from 'next/link';

//utils
import { useRouterId } from "~/utils/routerId";
import { useFetchProfile } from "~/utils/profile";

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
import UserProfileCard from "~/components/research-post/UserRecCards";
import UserProfileForm from "~/components/profile/UserProfileForm";
import EducationForm from "~/components/profile/EducationForm";
import EducationCard from "~/components/profile/EducationCard";
import Head from 'next/head';


const ProfilePage: NextPageWithLayout = () => {
  const id = useRouterId();
  const {
    name,
    about_me,
    skills,
    research_interest,
    isLoading,
    error
  } = useFetchProfile();

  return (
    <>
      {/* <Head title={name} /> */}
      <PageLoader isLoading={isLoading} errorMsg={error?.message}>
        
      



      {/* Tab */}
      </PageLoader>
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

//</>const ProfilePage: NextPageWithLayout = () => {
//   const id = useRouterId();
//   useFetchProfile();
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   const handleEditClick = () => {
//     setIsEditModalOpen(true);
//   };


//   return (
//     <>
//       {/* Scholarspace layout */}
//       <Layout>
//         <div>
//           {/* Content to display profile information */}
//           <div>
//             {/* ... Display profile information here */}
//             <FaEdit
//               onClick={handleEditClick}
//               className="cursor-pointer"
//               style={{ fontSize: '24px' }} // Adjust the icon size as needed
//             />
//           </div>

//           <div>

//           </div>
//         </div>

//         {/* UserProfileForm modal */}
//         {isEditModalOpen && (
//           <UserProfileForm
//             openModal={isEditModalOpen}
//             onClick={() => setIsEditModalOpen(false)}
//           />
//         )}

//         {/* Additional content within the Scholarspace layout */}

//       </Layout>
//     </>
//   );
// };


// export default ProfilePage;