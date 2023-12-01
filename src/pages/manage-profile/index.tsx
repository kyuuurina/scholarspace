//to-do: add loader

//utils
import { useFetchProfile } from "~/utils/profile";
import { useRouterId } from "~/utils/routerId";
import React from 'react';


// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import {api} from "~/utils/api";

//pages
import ErrorPage from "~/pages/error-page";

//local components
import Layout from "~/components/layout/Layout";
import LoadingSpinner from "~/components/LoadingSpinner";
import PrimaryButton from "~/components/button/PrimaryButton";
import AvatarPlaceholder from "~/components/AvatarPlaceholder";
import { FaEdit } from 'react-icons/fa';

import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';

//profile components
import UserProfileCard from "~/components/research-post/UserRecCards";
import UserProfileForm from "~/components/profile/UserProfileForm";
import EducationForm from "~/components/profile/EducationForm";
import EducationCard from "~/components/profile/EducationCard";



const ProfilePage: NextPageWithLayout = () => {
  const id = useRouterId();
  useFetchProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const educations = [
    {
      education_id: '1',
      school_name: 'University of California, Irvine',
      start_date: new Date('2016-09-01'),
      end_date: new Date('2020-06-01'),
    },
    {
      education_id: '2',
      school_name: 'University of California, Irvine',
      start_date: new Date('2016-09-01'),
      end_date: new Date('2020-06-01'),
    },
  ];

  return (
    <>
      {/* Scholarspace layout */}
      <Layout>
        <div>
          {/* Content to display profile information */}
          <div>
            {/* ... Display profile information here */}
            <FaEdit
              onClick={handleEditClick}
              className="cursor-pointer"
              style={{ fontSize: '24px' }} // Adjust the icon size as needed
            />
          </div>

          <div>
            <EducationCard educations = {educations} />
          </div>
          <div>

          </div>
        </div>

        {/* UserProfileForm modal */}
        {isEditModalOpen && (
          <UserProfileForm
            openModal={isEditModalOpen}
            onClick={() => setIsEditModalOpen(false)}
          />
        )}

        {/* Additional content within the Scholarspace layout */}

      </Layout>
    </>
  );
};


export default ProfilePage;