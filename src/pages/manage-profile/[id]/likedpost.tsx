//Query all post created by user, if null, display "You have not created any post yet"

import React from 'react';
import {useEffect, useState} from 'react';
import {api} from "~/utils/api";
import Image from 'next/image';
import Link from 'next/link';

//utils
import { useRouterId } from "~/utils/routerId";
import { useFetchProfile } from "~/utils/profile";
import { useQuery } from '@tanstack/react-query';

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

import ErrorPage from "~/pages/error-page";
//local components
import Layout from "~/components/layout/Layout";
import PageLoader from "~/components/layout/PageLoader";
import LoadingSpinner from "~/components/LoadingSpinner";
import PrimaryButton from "~/components/button/PrimaryButton";
import AvatarPlaceholder from "~/components/avatar/AvatarPlaceholder";
import { FaEdit } from 'react-icons/fa';

//profile components
import ProfileTabs from '~/components/profile/ProfileTabs';
import Head from 'next/head';

import { useRouter } from 'next/router';
import { useFetchResearchPost } from '~/utils/researchpost';
import { useFetchLikedPost } from '~/utils/researchpost';
import { FaExclamationCircle } from 'react-icons/fa';
import Post from '~/components/research-post/Post';
import EditPostForm from '~/components/research-post/EditPostForm';


const LikedPost: NextPageWithLayout = () => {
  const profile_id = useRouterId();
  console.log("Front call",profile_id)
  const LikedPost = useFetchLikedPost(profile_id);
  const router = useRouter();

  const { name, isLoading } = useFetchProfile();  //To print in head
  

  console.log("LikedPosttsx page router:", router)

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // query key for refetch
  const postQueryKey = ['getLikedPost', currentPostId]; // Assuming have a valid post ID
  const { data: updatedPostData, refetch: refetchPost } = useQuery(
    postQueryKey,
    { enabled: false } // Disable automatic fetching on mount
  );

    // Render EditPostForm component
    const handleEditClick = (postId: string) => {
      setEditModalOpen(true);
      setCurrentPostId(postId);
    };


  return (
    <>
      <Head>
        <title>{`${name ?? 'User'}'s Posts`}</title>
      </Head>
      <ProfileTabs />

      <div className="container mx-auto mt-8">
        {/* if loading */}
        {LikedPost. isLoadingLikedpost && <LoadingSpinner />}
        {LikedPost.errorLikedpost && (
          <div className="flex flex-col items-center justify-center h-50vh">
            <FaExclamationCircle className="text-gray-500 text-4xl mb-4" />
            <p className="font-semibold text-lg text-gray-500 leading-1.5 text-center max-w-md">
              Oops! Something went wrong.
            </p>
          </div>
        )}

        {/* if post exist */}
        {LikedPost.myLikedPosts.length > 0 ? (
          <ul className="grid grid-cols-1 gap-8">
            {LikedPost.myLikedPosts.map((post) => (
              <li key={post.post_id} className="mb-4">
                {/* Add left and right padding to the Post component */}
                <div className="p-4 rounded-md">
                <Post
                  post={post}
                  onEditClick={() => handleEditClick(post.post_id)}
                  refetch={refetchPost}
                   />
                  {/* <Post post={post} /> */}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-50vh">
            <FaExclamationCircle className="text-gray-500 text-4xl mb-4" />
            <p className="font-semibold text-lg text-gray-500 leading-1.5 text-center max-w-md">
              Uh-oh, you have not created any posts yet. Create one by clicking on the button above!
            </p>
            <p className="font-medium text-base text-gray-500 leading-1.5 text-center max-w-md">
              Navigate to the Home Page to add a new post and share your research!
            </p>
          </div>
        )}

        {/* Render EditPostForm component */}
        {editModalOpen && (
        <EditPostForm
          openModal={editModalOpen}
          onClick={() => setEditModalOpen(false)}
          postIdToEdit={currentPostId || ''}
        />
      )}
      </div>
    </>
  );
};


LikedPost.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default LikedPost;