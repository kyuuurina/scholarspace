//Query all post created by user, if null, display "You have not created any post yet"

import React from 'react';
import {useState} from 'react';
import {api} from '~/utils/api';
import { useUser } from '@supabase/auth-helpers-react';

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

//profile components
import ProfileTabs from '~/components/profile/ProfileTabs';
import Head from 'next/head';

//research post components
import AddNewPostButton from '~/components/research-post/AddNewPostButton';
import {MyPosts} from '~/utils/researchpost';
import { FaExclamationCircle } from 'react-icons/fa';
import Post from '~/components/research-post/Post';
import EditPostForm from '~/components/research-post/EditPostForm';


const MyCreatedPost: NextPageWithLayout = () => {

  const profile_id = useRouterId();

  // Fetch user_id using getUserIdByProfileId
  const userId = api.profile.getUserIdByProfileId.useQuery({
    profile_id: profile_id,
  }).data;

  // Fetch liked posts based on user_id
  const MyCreatedPost = MyPosts(userId || '');

  const { name, isLoading } = useFetchProfile();  //To print in head

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);

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

    if (MyCreatedPost.isLoadingMyPost) {
      return <LoadingSpinner />;
  }

  const noPostsMessage = (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* <FaExclamationCircle className="text-gray-500 text-5xl mb-4" /> */}
      <p className="font-semibold text-2xl text-gray-500 leading-1.5 text-center max-w-md">
        No research posts have been created yet
      </p>
    </div>
  );

  const errorMessage = (
    <div className="flex flex-col items-center justify-center h-screen">
        <FaExclamationCircle className="text-gray-500 text-4xl mb-4" />
        <p className="font-semibold text-lg text-gray-500 leading-1.5 text-center max-w-md">
         Oops! Something went wrong.
      </p>
    </div>
  );

  return (
    <>
      <Head>
        <title>{`${name ?? 'User'}'s Posts`}</title>
      </Head>
      <ProfileTabs />

      <div className="container mx-auto mt-8">
      <AddNewPostButton className="mb-4" />
        {/* if error*/}
        {MyCreatedPost.errorMyPost && (
          errorMessage
        )}

        {/* if post exist */}
        {MyCreatedPost.myPost.length > 0 ? (
          <ul className="grid grid-cols-1 gap-8">
            {MyCreatedPost.myPost.map((post) => (
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
          noPostsMessage
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


MyCreatedPost.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default MyCreatedPost;