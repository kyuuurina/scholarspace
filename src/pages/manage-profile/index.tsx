//to-do: add loader

//utils
import { useRouterId } from "~/utils/routerId";
import { useFetchProfile } from "~/utils/profile";
import React, { useState } from 'react';

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

//local components
import Layout from "~/components/layout/Layout";
import UserProfileForm from "~/components/profile/UserProfileForm";
import { FaEdit } from 'react-icons/fa';


const ProfilePage: NextPageWithLayout = () => {
  const id = useRouterId();
  useFetchProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

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
        </div>

        {/* UserProfileForm modal */}
        {isEditModalOpen && (
          <UserProfileForm
            openModal={isEditModalOpen}
            onClick={() => setIsEditModalOpen(false)}
          />
        )}

        {/* Additional content within the Scholarspace layout */}
        <div>Profile Page</div>
      </Layout>
    </>
  );
};

export default ProfilePage;